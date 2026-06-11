import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ReviewLog, Topic } from '../types'
import { listLogs, listTopics } from '../lib/db'
import { isDue, overdueDays, fmtDate } from '../lib/srs'

export default function Dashboard() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [logs, setLogs] = useState<ReviewLog[]>([])

  useEffect(() => {
    listTopics().then(setTopics)
    listLogs().then(setLogs)
  }, [])

  const due = topics.filter(isDue)
  const todayCount = due.filter((t) => overdueDays(t) === 0).length
  const overdueCount = due.filter((t) => overdueDays(t) > 0).length
  const scored = topics.filter((t) => t.review.score !== null)
  const avg = scored.length
    ? (scored.reduce((s, t) => s + (t.review.score ?? 0), 0) / scored.length).toFixed(1)
    : '-'

  const topicMap = new Map(topics.map((t) => [t.id, t]))
  const recent = [...logs]
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt))
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="오늘 복습" value={todayCount} accent="text-amber-400" />
        <StatCard label="지연 복습" value={overdueCount} accent="text-rose-400" />
        <StatCard label="전체 토픽" value={topics.length} accent="text-sky-400" />
        <StatCard label="평균 점수" value={avg} accent="text-emerald-400" />
      </div>

      {due.length > 0 ? (
        <Link to="/review" className="btn-primary w-full py-3 text-base">
          오늘의 복습 시작 ({due.length}건)
        </Link>
      ) : (
        <div className="card text-center text-sm text-slate-400">
          오늘 복습할 토픽이 없습니다. 잘 하고 있어요!
        </div>
      )}

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">최근 학습 현황</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500">
            아직 복습 기록이 없습니다.{' '}
            <Link to="/topics/new" className="text-sky-400 underline">
              첫 토픽을 등록
            </Link>
            해 보세요.
          </p>
        ) : (
          <ul className="divide-y divide-slate-800">
            {recent.map((l) => (
              <li key={l.id} className="py-2 flex items-center justify-between gap-2">
                <Link
                  to={`/topics/${l.topicId}`}
                  className="text-sm truncate hover:text-sky-400"
                >
                  {topicMap.get(l.topicId)?.title ?? '(삭제된 토픽)'}
                </Link>
                <span className="text-xs text-slate-500 shrink-0">
                  {fmtDate(l.reviewedAt)} · {l.score}점
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent
}: {
  label: string
  value: number | string
  accent: string
}) {
  return (
    <div className="card">
      <div className="text-xs text-slate-400">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent}`}>{value}</div>
    </div>
  )
}
