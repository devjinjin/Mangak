export interface Category {
  id: string
  name: string
  color: string
  sortOrder: number
  createdAt: string
}

export interface ReviewState {
  lastReviewedAt: string | null
  nextReviewAt: string
  score: number | null
  reviewCount: number
  failCount: number
}

export interface Topic {
  id: string
  title: string
  description: string
  memorizationDescription: string
  /** 두음(頭音) — 두문자/초성 암기 보조 */
  dueum: string
  categoryId: string | null
  tags: string[]
  /** 정리 이미지 목록 (Base64 Data URL, 순서 보존) */
  images: string[]
  /** @deprecated v1 단일 이미지 필드 — 기존 데이터/Import 호환용 */
  imageData?: string | null
  createdAt: string
  updatedAt: string
  review: ReviewState
}

export interface ReviewLog {
  id: string
  topicId: string
  reviewedAt: string
  score: number
  nextReviewAt: string
}

export interface ExportData {
  app: string
  version: number
  exportedAt: string
  categories: Category[]
  topics: Topic[]
  reviewLogs: ReviewLog[]
}
