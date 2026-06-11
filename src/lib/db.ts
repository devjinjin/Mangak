import type { Category, Topic, ReviewLog, ExportData } from '../types'

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

export function listTopics(): Promise<Topic[]> {
  return tx<Topic[]>('topics', 'readonly', (s) => s.getAll())
}

export function getTopic(id: string): Promise<Topic | undefined> {
  return tx<Topic | undefined>('topics', 'readonly', (s) => s.get(id))
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
    app: 'techmaster-recall',
    version: 1,
    exportedAt: new Date().toISOString(),
    categories,
    topics,
    reviewLogs
  }
}

export async function importData(
  data: ExportData,
  mode: 'overwrite' | 'merge'
): Promise<{ categories: number; topics: number; reviewLogs: number }> {
  if (!data || !Array.isArray(data.topics)) {
    throw new Error('올바른 내보내기 파일이 아닙니다.')
  }
  if (mode === 'overwrite') await clearAll()
  for (const c of data.categories ?? []) await saveCategory(c)
  for (const t of data.topics ?? []) await saveTopic(t)
  for (const l of data.reviewLogs ?? []) await addLog(l)
  return {
    categories: (data.categories ?? []).length,
    topics: (data.topics ?? []).length,
    reviewLogs: (data.reviewLogs ?? []).length
  }
}

export async function clearAll(): Promise<void> {
  for (const store of STORES) {
    await tx(store, 'readwrite', (s) => s.clear())
  }
}
