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
  categoryId: string | null
  tags: string[]
  imageData: string | null
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
