import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import type { Topic } from '../types'
import { addLog, getTopic, listTopics, saveTopic } from '../lib/db'
import {
  applyReview,
  dueCompare,
  INTERVAL_DAYS,
  isDue,
  SCORE_LABELS
} from '../lib/srs'

export default function Review() {
  const [params] = useSearchParams()
  const single = params.get('topic')

  const [queue, setQueue] = useState<Topic[]>([])
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (single) {
      getTopic(single).then((t) => {
        setQueue(t ? [t] : [])
        setLoaded(true)
      })
    } else {
      listTopics().then((ts) => {
        setQueue(ts.filter(isDue).sort(dueCompare))
        setLoaded(true)
      })
    }
  }, [single])

  const current = queue[index]

  const onScore = useCallback(
    async (score: number) => {
      if (!current) return
      const { topic, log } = applyReview(current, score)
      await saveTopic(topic)
      await addLog(log)
      setDone((d) => d + 1)
      setRevealed(false)
      setIndex((i) => i + 1)
    },
    [current]
  )

  // 키보드 단축키: Space/Enter = 정답 보기, 1~5 = 자가평가
  useEffect(() => {
    if (!current) return
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (!revealed) {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          setRevealed(true)
        }
        return
      }
      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault()
        onScore(Number(e.key))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, revealed, onScore])

  if (!loaded) return null

  if (!current) {
    return (
      <div className="card text-center space-y-3 py-10">
        <p className="text-2xl font-bold">
          {done > 0 ? '복습 완료' : '복습할 토픽이 없습니다'}
        </p>
        <p className="text-sm text-slate-400">
          {done > 0
            ? `${done}개 토픽을 인출했습니다. 다음 복습일이 자동 계산되었습니다.`
            : '새 토픽을 등록하거나 내일 다시 확인하세요.'}
        </p>
        <div className="flex justify-center gap-2">
          <Link to="/" className="btn-primary">
            대시보드로
          </Link>
          <Link to="/topics" className="btn-secondary">
            토픽 목록
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span>
            {index + 1} / {queue.length}
          </span>
          <span>완료 {done}</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-sky-500 transition-all duration-300"
            style={{ width: `${(index / queue.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card space-y-4">
        <div className="flex items-center justify-between gap-2 py-2">
          <span className="w-12" />
          <h1 className="flex-1 text-xl font-bold text-center">{current.title}</h1>
          <Link
            to={`/topics/${current.id}/edit`}
            className="btn-secondary shrink-0 text-xs"
          >
            수정
          </Link>
        </div>

        {!revealed ? (
          <>
            <div className="border border-dashed border-slate-700 rounded-lg py-14 text-center text-sm text-slate-500">
              설명, 암기설명, 이미지가 숨겨져 있습니다.
              <br />
              머릿속으로 백지복기한 뒤 정답을 확인하세요.
            </div>
            <button
              className="btn-primary w-full py-3 text-base"
              onClick={() => setRevealed(true)}
            >
              정답 보기
              <kbd className="ml-2 hidden sm:inline rounded bg-sky-700/60 px-1.5 py-0.5 text-[11px] font-normal">
                Space
              </kbd>
            </button>
          </>
        ) : (
          <>
            {current.memorizationDescription && (
              <section className="rounded-lg border border-sky-500/50 bg-sky-950/40 p-4">
                <h2 className="text-sm font-bold text-sky-400 mb-2">암기설명</h2>
                <p className="text-lg font-semibold leading-relaxed text-sky-100 whitespace-pre-wrap">
                  {current.memorizationDescription}
                </p>
              </section>
            )}
            {current.description && (
              <section className="rounded-lg border border-sky-500/50 bg-sky-950/40 p-4">
                <h2 className="text-sm font-bold text-sky-400 mb-2">설명</h2>
                <p className="text-base text-slate-300 whitespace-pre-wrap">
                  {current.description}
                </p>
              </section>
            )}
            {current.images.length > 0 ? (
              <section>
                <h2 className="text-xs font-semibold text-slate-500 mb-2">이미지</h2>
                <div className="space-y-2">
                  {current.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${current.title} ${i + 1}`}
                      className="rounded-lg border border-slate-800 w-full"
                    />
                  ))}
                </div>
              </section>
            ) : (
              <div className="text-center text-sm text-slate-500 py-4">
                등록된 이미지가 없습니다.
              </div>
            )}

            <div>
              <p className="text-xs text-slate-400 mb-2 text-center">
                얼마나 인출했는지 자가 평가하세요
              </p>
              <div className="grid grid-cols-1 gap-2">
                {[5, 4, 3, 2, 1].map((s) => (
                  <button
                    key={s}
                    onClick={() => onScore(s)}
                    className={`btn justify-between px-4 ${
                      s >= 4
                        ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200'
                        : s === 3
                          ? 'bg-amber-900/60 hover:bg-amber-800 text-amber-200'
                          : 'bg-rose-900/60 hover:bg-rose-800 text-rose-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <kbd className="hidden sm:inline rounded bg-black/25 px-1.5 py-0.5 text-[11px] font-normal">
                        {s}
                      </kbd>
                      {s}점 · {SCORE_LABELS[s]}
                    </span>
                    <span className="text-xs opacity-70">+{INTERVAL_DAYS[s]}일 후</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
