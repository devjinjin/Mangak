import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category, ReviewLog, Topic } from '../types'
import { listCategories, listLogs, listTopics } from '../lib/db'
import { dueBadge, isWeak } from '../lib/srs'

const DAY = 86_400_000

export default function Statistics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [logs, setLogs] = useState<ReviewLog[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    listTopics().then(setTopics)
    listLogs().then(setLogs)
    listCategories().then(setCategories)
  }, [])

  const scored = topics.filter((t) => t.review.score !== null)
  const avg = scored.length
    ? (scored.reduce((s, t) => s + (t.review.score ?? 0), 0) / scored.length).toFixed(1)
    : '-'

  // 카테고리별 평균 점수
  const catStats = useMemo(() => {
    return categories.map((c) => {
      const ts = topics.filter((t) => t.categoryId === c.id)
      const sc = ts.filter((t) => t.review.score !== null)
      const a = sc.length
        ? (sc.reduce((s, t) => s + (t.review.score ?? 0), 0) / sc.length).toFixed(1)
        : '-'
      return { cat: c, count: ts.length, avg: a }
    })
  }, [categories, topics])

  // 최근 7일 학습량
  const week = useMemo(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const days: { label: string; count: number }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(start.getTime() - i * DAY)
      const next = new Date(d.getTime() + DAY)
      const count = logs.filter((l) => {
        const t = new Date(l.reviewedAt).getTime()
        return t >= d.getTime() && t < next.getTime()
      }).length
      days.push({ label: `${d.getMonth() + 1}/${d.getDate()}`, count })
    }
    return days
  }, [logs])

  const maxCount = Math.max(1, ...week.map((d) => d.count))
  const weakTopics = topics.filter(isWeak)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="전체 토픽" value={topics.length} />
        <Stat label="총 복습 횟수" value={logs.length} />
        <Stat label="평균 점수" value={avg} />
      </div>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">최근 7일 학습량</h2>
        <div className="flex items-end gap-2 h-28">
          {week.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-slate-400">{d.count || ''}</span>
              <div
                className="w-full rounded-t bg-sky-600/80 min-h-[2px]"
                style={{ height: `${(d.count / maxCount) * 80}px` }}
              />
              <span className="text-[10px] text-slate-500">{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">카테고리별 숙련도</h2>
        {catStats.length === 0 ? (
          <p className="text-sm text-slate-500">카테고리가 없습니다.</p>
        ) : (
          <ul className="divide-y divide-slate-800 text-sm">
            {catStats.map(({ cat, count, avg: a }) => (
              <li key={cat.id} className="py-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </span>
                <span className="text-slate-400">
                  {count}개 · 평균 {a}점
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">
          취약 토픽 ({weakTopics.length})
        </h2>
        <p className="text-xs text-slate-500 mb-2">
          최근 점수 2 이하 · 실패 2회 이상 · 7일 이상 지연
        </p>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-slate-500">취약 토픽이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {weakTopics.map((t) => {
              const badge = dueBadge(t)
              return (
                <li key={t.id}>
                  <Link
                    to={`/topics/${t.id}`}
                    className="flex items-center justify-between text-sm hover:text-sky-400"
                  >
                    <span className="truncate">{t.title}</span>
                    <span className={`badge shrink-0 ${badge.cls}`}>{badge.text}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="card text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  )
}
