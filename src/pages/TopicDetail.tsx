import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Category, ReviewLog, Topic } from '../types'
import { deleteTopic, getTopic, listCategories, listLogs } from '../lib/db'
import { dueBadge, fmtDate } from '../lib/srs'

export default function TopicDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [topic, setTopic] = useState<Topic | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [logs, setLogs] = useState<ReviewLog[]>([])
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    getTopic(id).then((t) => (t ? setTopic(t) : setNotFound(true)))
    listCategories().then(setCategories)
    listLogs(id).then((ls) =>
      setLogs(ls.sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt)))
    )
  }, [id])

  if (notFound) {
    return <div className="card text-sm text-slate-400">토픽을 찾을 수 없습니다.</div>
  }
  if (!topic) return null

  const cat = categories.find((c) => c.id === topic.categoryId)
  const badge = dueBadge(topic)

  const onDelete = async () => {
    if (!window.confirm(`'${topic.title}' 토픽을 삭제할까요?`)) return
    let delLogs = false
    if (logs.length > 0) {
      delLogs = window.confirm(
        `복습 이력 ${logs.length}건도 함께 삭제할까요?\n확인 = 함께 삭제 / 취소 = 이력 보존`
      )
    }
    await deleteTopic(topic.id, delLogs)
    navigate('/topics')
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h1 className="text-lg font-bold">{topic.title}</h1>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
              {cat && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </span>
              )}
              {topic.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </div>
          </div>
          <span className={`badge shrink-0 ${badge.cls}`}>{badge.text}</span>
        </div>

        {topic.description && (
          <section className="mt-4">
            <h2 className="text-xs font-semibold text-slate-500 mb-1">설명</h2>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {topic.description}
            </p>
          </section>
        )}

        {topic.dueum && (
          <section className="mt-4">
            <h2 className="text-xs font-semibold text-slate-500 mb-1">두음</h2>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">{topic.dueum}</p>
          </section>
        )}

        {topic.memorizationDescription && (
          <section className="mt-4">
            <h2 className="text-xs font-semibold text-slate-500 mb-1">암기설명</h2>
            <p className="text-sm text-slate-300 whitespace-pre-wrap">
              {topic.memorizationDescription}
            </p>
          </section>
        )}

        {topic.images.length > 0 && (
          <section className="mt-4">
            <h2 className="text-xs font-semibold text-slate-500 mb-2">이미지</h2>
            <div className="space-y-2">
              {topic.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${topic.title} ${i + 1}`}
                  className="rounded-lg border border-slate-800 w-full"
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="card grid grid-cols-2 gap-y-2 text-sm">
        <Info label="복습 횟수" value={`${topic.review.reviewCount}회`} />
        <Info label="실패 횟수" value={`${topic.review.failCount}회`} />
        <Info label="최근 점수" value={topic.review.score !== null ? `${topic.review.score}점` : '-'} />
        <Info label="다음 복습일" value={fmtDate(topic.review.nextReviewAt)} />
        <Info label="마지막 복습" value={fmtDate(topic.review.lastReviewedAt)} />
        <Info label="등록일" value={fmtDate(topic.createdAt)} />
      </div>

      <div className="flex gap-2">
        <Link to={`/review?topic=${topic.id}`} className="btn-primary flex-1 py-3">
          인출 시작
        </Link>
        <Link to={`/topics/${topic.id}/edit`} className="btn-secondary">
          수정
        </Link>
        <button onClick={onDelete} className="btn-danger">
          삭제
        </button>
      </div>

      <section className="card">
        <h2 className="text-sm font-semibold text-slate-300 mb-2">복습 이력</h2>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">복습 기록이 없습니다.</p>
        ) : (
          <ul className="divide-y divide-slate-800 text-sm">
            {logs.map((l) => (
              <li key={l.id} className="py-2 flex justify-between">
                <span className="text-slate-400">{fmtDate(l.reviewedAt)}</span>
                <span>
                  {l.score}점 → 다음 {fmtDate(l.nextReviewAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-slate-500 text-xs">{label}</span>
      <div>{value}</div>
    </div>
  )
}
