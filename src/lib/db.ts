import type { Category, Topic, ReviewLog, ExportData, ReviewState } from '../types'
import { newReviewState } from './srs'

// 브랜드명은 Mangak이지만 DB 이름은 변경하지 않는다.
// 변경 시 기존 사용자의 IndexedDB 데이터가 통째로 분리되어 유실되기 때문.
const DB_NAME = 'techmaster-recall'
const DB_VERSION = 1
const STORES = ['categories', 'topics', 'reviewLogs'] as const
type StoreName = (typeof STORES)[number]

let dbPromise: Promise<IDBDatabase> | null = null

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' })
      }
      if (!db.objectStoreNames.contains('topics')) {
        const s = db.createObjectStore('topics', { keyPath: 'id' })
        s.createIndex('categoryId', 'categoryId')
      }
      if (!db.objectStoreNames.contains('reviewLogs')) {
        const s = db.createObjectStore('reviewLogs', { keyPath: 'id' })
        s.createIndex('topicId', 'topicId')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
  return dbPromise
}

function tx<T>(
  store: StoreName,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, mode)
        const req = fn(t.objectStore(store))
        req.onsuccess = () => resolve(req.result as T)
        req.onerror = () => reject(req.error)
      })
  )
}

// ---------- Category ----------

export function listCategories(): Promise<Category[]> {
  return tx<Category[]>('categories', 'readonly', (s) => s.getAll()).then((cs) =>
    cs.sort((a, b) => a.sortOrder - b.sortOrder)
  )
}

export function saveCategory(c: Category): Promise<unknown> {
  return tx('categories', 'readwrite', (s) => s.put(c))
}

/** 카테고리 삭제. 해당 카테고리의 토픽은 미분류(null)로 이동 */
export async function deleteCategory(id: string): Promise<void> {
  await tx('categories', 'readwrite', (s) => s.delete(id))
  const topics = await listTopics()
  await Promise.all(
    topics
      .filter((t) => t.categoryId === id)
      .map((t) => saveTopic({ ...t, categoryId: null }))
  )
}

// ---------- Topic ----------

/** 누락·손상된 review 상태를 기본값으로 보정 */
function normalizeReview(r: Partial<ReviewState> | null | undefined): ReviewState {
  const base = newReviewState()
  if (!r || typeof r !== 'object') return base
  return {
    lastReviewedAt: typeof r.lastReviewedAt === 'string' ? r.lastReviewedAt : null,
    nextReviewAt: typeof r.nextReviewAt === 'string' ? r.nextReviewAt : base.nextReviewAt,
    score: typeof r.score === 'number' ? r.score : null,
    reviewCount: typeof r.reviewCount === 'number' ? r.reviewCount : 0,
    failCount: typeof r.failCount === 'number' ? r.failCount : 0
  }
}

/**
 * 토픽을 앱이 가정하는 형태로 정규화한다.
 * - v1 단일 imageData → images[] 마이그레이션
 * - review/images 등 필수 필드 누락·손상 보정 (외부·구버전 Import 방어)
 */
function normalizeTopic(t: Topic): Topic {
  if (!Array.isArray(t.images)) {
    t.images = t.imageData ? [t.imageData] : []
  }
  t.review = normalizeReview(t.review)
  return t
}

export function listTopics(): Promise<Topic[]> {
  return tx<Topic[]>('topics', 'readonly', (s) => s.getAll()).then((ts) =>
    ts.map(normalizeTopic)
  )
}

export function getTopic(id: string): Promise<Topic | undefined> {
  return tx<Topic | undefined>('topics', 'readonly', (s) => s.get(id)).then((t) =>
    t ? normalizeTopic(t) : t
  )
}

export function saveTopic(t: Topic): Promise<unknown> {
  return tx('topics', 'readwrite', (s) => s.put(t))
}

/** 토픽 삭제. deleteLogs=true면 관련 ReviewLog도 삭제 */
export async function deleteTopic(id: string, deleteLogs: boolean): Promise<void> {
  await tx('topics', 'readwrite', (s) => s.delete(id))
  if (deleteLogs) {
    const logs = await listLogs(id)
    await Promise.all(
      logs.map((l) => tx('reviewLogs', 'readwrite', (s) => s.delete(l.id)))
    )
  }
}

// ---------- ReviewLog ----------

export function listLogs(topicId?: string): Promise<ReviewLog[]> {
  if (topicId) {
    return tx<ReviewLog[]>('reviewLogs', 'readonly', (s) =>
      s.index('topicId').getAll(topicId)
    )
  }
  return tx<ReviewLog[]>('reviewLogs', 'readonly', (s) => s.getAll())
}

export function addLog(l: ReviewLog): Promise<unknown> {
  return tx('reviewLogs', 'readwrite', (s) => s.put(l))
}

// ---------- Export / Import / Reset ----------

export async function exportData(): Promise<ExportData> {
  const [categories, topics, reviewLogs] = await Promise.all([
    listCategories(),
    listTopics(),
    listLogs()
  ])
  return {
    app: 'mangak',
    version: 1,
    exportedAt: new Date().toISOString(),
    categories,
    topics,
    reviewLogs
  }
}

export interface ImportResult {
  categories: number
  topics: number
  reviewLogs: number
  /** 필수 필드(id·title) 누락으로 건너뛴 토픽 수 */
  skippedTopics: number
}

/** id·title을 갖춘 객체만 토픽으로 인정 */
function isImportableTopic(t: unknown): t is Topic {
  return (
    !!t &&
    typeof t === 'object' &&
    typeof (t as Topic).id === 'string' &&
    typeof (t as Topic).title === 'string'
  )
}

export async function importData(
  data: ExportData,
  mode: 'overwrite' | 'merge'
): Promise<ImportResult> {
  if (!data || typeof data !== 'object' || !Array.isArray(data.topics)) {
    throw new Error('올바른 내보내기 파일이 아닙니다.')
  }
  if (mode === 'overwrite') await clearAll()

  const categories = Array.isArray(data.categories) ? data.categories : []
  const reviewLogs = Array.isArray(data.reviewLogs) ? data.reviewLogs : []

  let skippedTopics = 0
  let savedTopics = 0
  for (const raw of data.topics) {
    if (!isImportableTopic(raw)) {
      skippedTopics++
      continue
    }
    // 읽기 시점뿐 아니라 저장 시점에도 정규화해 손상 데이터의 DB 유입을 차단
    await saveTopic(normalizeTopic(raw))
    savedTopics++
  }
  for (const c of categories) await saveCategory(c)
  for (const l of reviewLogs) await addLog(l)

  return {
    categories: categories.length,
    topics: savedTopics,
    reviewLogs: reviewLogs.length,
    skippedTopics
  }
}

export async function clearAll(): Promise<void> {
  for (const store of STORES) {
    await tx(store, 'readwrite', (s) => s.clear())
  }
}
