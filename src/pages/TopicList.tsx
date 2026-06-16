import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Category, Topic } from '../types'
import { listCategories, listTopics } from '../lib/db'
import { dueBadge } from '../lib/srs'

export default function TopicList() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [q, setQ] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [tagFilter, setTagFilter] = useState('')

  useEffect(() => {
    listTopics().then(setTopics)
    listCategories().then(setCategories)
  }, [])

  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories])
  const allTags = useMemo(
    () => Array.from(new Set(topics.flatMap((t) => t.tags))).sort(),
    [topics]
  )

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase()
    return topics
      .filter((t) => {
        if (catFilter && t.categoryId !== catFilter) return false
        if (tagFilter && !t.tags.includes(tagFilter)) return false
        if (!kw) return true
        const catName = t.categoryId ? catMap.get(t.categoryId)?.name ?? '' : ''
        return (
          t.title.toLowerCase().includes(kw) ||
          t.description.toLowerCase().includes(kw) ||
          t.memorizationDescription.toLowerCase().includes(kw) ||
          t.dueum.toLowerCase().includes(kw) ||
          catName.toLowerCase().includes(kw) ||
          t.tags.some((tag) => tag.toLowerCase().includes(kw))
        )
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  }, [topics, q, catFilter, tagFilter, catMap])

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          className="input"
          placeholder="제목 · 설명 · 태그 검색"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select
          className="input"
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
        >
          <option value="">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          className="input"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        >
          <option value="">전체 태그</option>
          {allTags.map((t) => (
            <option key={t} value={t}>
              #{t}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">{filtered.length}개 토픽</p>
        <Link to="/categories" className="text-xs text-sky-400 hover:underline">
          카테고리 관리
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center text-sm text-slate-400">
          토픽이 없습니다.{' '}
          <Link to="/topics/new" className="text-sky-400 underline">
            새 토픽 등록
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((t) => {
            const cat = t.categoryId ? catMap.get(t.categoryId) : undefined
            const badge = dueBadge(t)
            return (
              <li key={t.id}>
                <Link to={`/topics/${t.id}`} className="card block hover:border-sky-700">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {cat && (
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                        />
                      )}
                      <span className="font-medium truncate">{t.title}</span>
                    </div>
                    <span className={`badge shrink-0 ${badge.cls}`}>{badge.text}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    {cat && <span>{cat.name}</span>}
                    {t.tags.map((tag) => (
                      <span key={tag} className="text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
