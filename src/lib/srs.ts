import type { ReviewLog, ReviewState, Topic } from '../types'

const DAY = 86_400_000

/** 점수별 다음 복습 간격(일) — MVP 망각곡선 */
export const INTERVAL_DAYS: Record<number, number> = {
  1: 1,
  2: 3,
  3: 7,
  4: 14,
  5: 30
}

export const SCORE_LABELS: Record<number, string> = {
  1: '전혀 기억 안 남',
  2: '거의 기억 안 남',
  3: '절반 정도 인출',
  4: '대부분 인출',
  5: '완벽히 인출'
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** 신규 토픽의 초기 복습 상태 — 즉시 복습 대상 */
export function newReviewState(): ReviewState {
  return {
    lastReviewedAt: null,
    nextReviewAt: new Date().toISOString(),
    score: null,
    reviewCount: 0,
    failCount: 0
  }
}

/**
 * 자가 평가 점수를 반영해 토픽의 복습 상태를 갱신하고 ReviewLog를 생성한다.
 * - reviewCount 증가, 점수 1~2는 failCount 증가
 * - nextReviewAt = 오늘 + 점수별 간격
 */
export function applyReview(topic: Topic, score: number): { topic: Topic; log: ReviewLog } {
  const now = new Date()
  const interval = INTERVAL_DAYS[score] ?? 1
  const next = new Date(now.getTime() + interval * DAY)
  const review: ReviewState = {
    lastReviewedAt: now.toISOString(),
    nextReviewAt: next.toISOString(),
    score,
    reviewCount: topic.review.reviewCount + 1,
    failCount: topic.review.failCount + (score <= 2 ? 1 : 0)
  }
  return {
    topic: { ...topic, review },
    log: {
      id: crypto.randomUUID(),
      topicId: topic.id,
      reviewedAt: now.toISOString(),
      score,
      nextReviewAt: next.toISOString()
    }
  }
}

/** 복습 예정일 기준 지연 일수. 양수=지연, 0=오늘, 음수=미래 */
export function overdueDays(t: Topic): number {
  const next = new Date(t.review.nextReviewAt)
  next.setHours(0, 0, 0, 0)
  return Math.round((startOfToday().getTime() - next.getTime()) / DAY)
}

/** 오늘의 복습 대상 여부 (nextReviewAt <= 오늘) */
export function isDue(t: Topic): boolean {
  return overdueDays(t) >= 0
}

/** 복습 큐 정렬: 1) 지연 큰 순 2) 낮은 점수 3) 오래 복습하지 않은 순 */
export function dueCompare(a: Topic, b: Topic): number {
  const od = overdueDays(b) - overdueDays(a)
  if (od !== 0) return od
  const sa = a.review.score ?? 0
  const sb = b.review.score ?? 0
  if (sa !== sb) return sa - sb
  const la = a.review.lastReviewedAt ? new Date(a.review.lastReviewedAt).getTime() : 0
  const lb = b.review.lastReviewedAt ? new Date(b.review.lastReviewedAt).getTime() : 0
  return la - lb
}

/** 취약 토픽: 최근 점수 2 이하 / failCount 2 이상 / 복습 지연 7일 이상 */
export function isWeak(t: Topic): boolean {
  if (t.review.score !== null && t.review.score <= 2) return true
  if (t.review.failCount >= 2) return true
  if (overdueDays(t) >= 7) return true
  return false
}

export function fmtDate(iso: string | null): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

/** D-day 배지 텍스트 */
export function dueBadge(t: Topic): { text: string; cls: string } {
  const d = overdueDays(t)
  if (t.review.reviewCount === 0 && d >= 0) {
    return { text: '신규', cls: 'bg-sky-900 text-sky-300' }
  }
  if (d > 0) return { text: `${d}일 지연`, cls: 'bg-rose-900 text-rose-300' }
  if (d === 0) return { text: '오늘 복습', cls: 'bg-amber-900 text-amber-300' }
  return { text: `D-${-d}`, cls: 'bg-slate-800 text-slate-400' }
}
