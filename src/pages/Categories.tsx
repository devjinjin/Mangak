import { useEffect, useState } from 'react'
import type { Category } from '../types'
import { deleteCategory, listCategories, saveCategory } from '../lib/db'

const PALETTE = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899'
]

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [color, setColor] = useState(PALETTE[5])
  const [editingId, setEditingId] = useState<string | null>(null)

  const reload = () => listCategories().then(setCategories)
  useEffect(() => {
    reload()
  }, [])

  const onSubmit = async () => {
    if (!name.trim()) {
      window.alert('카테고리 이름을 입력하세요.')
      return
    }
    if (editingId) {
      const c = categories.find((c) => c.id === editingId)
      if (c) await saveCategory({ ...c, name: name.trim(), color })
    } else {
      await saveCategory({
        id: crypto.randomUUID(),
        name: name.trim(),
        color,
        sortOrder: categories.length
          ? Math.max(...categories.map((c) => c.sortOrder)) + 1
          : 0,
        createdAt: new Date().toISOString()
      })
    }
    setName('')
    setEditingId(null)
    await reload()
  }

  const onEdit = (c: Category) => {
    setEditingId(c.id)
    setName(c.name)
    setColor(c.color)
  }

  const onDelete = async (c: Category) => {
    if (
      !window.confirm(
        `'${c.name}' 카테고리를 삭제할까요?\n해당 카테고리의 토픽은 미분류로 이동합니다.`
      )
    )
      return
    await deleteCategory(c.id)
    if (editingId === c.id) {
      setEditingId(null)
      setName('')
    }
    await reload()
  }

  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= categories.length) return
    const a = categories[i]
    const b = categories[j]
    await saveCategory({ ...a, sortOrder: b.sortOrder })
    await saveCategory({ ...b, sortOrder: a.sortOrder })
    await reload()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">카테고리 관리</h1>

      <div className="card space-y-3">
        <div>
          <label className="label">{editingId ? '카테고리 수정' : '새 카테고리'}</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 네트워크, DB, 보안, SW공학"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${
                color === c ? 'border-white' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn-primary flex-1" onClick={onSubmit}>
            {editingId ? '수정 저장' : '추가'}
          </button>
          {editingId && (
            <button
              className="btn-secondary"
              onClick={() => {
                setEditingId(null)
                setName('')
              }}
            >
              취소
            </button>
          )}
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="card text-center text-sm text-slate-400">
          카테고리가 없습니다. 위에서 추가하세요.
        </div>
      ) : (
        <ul className="space-y-2">
          {categories.map((c, i) => (
            <li key={c.id} className="card flex items-center gap-3 py-3">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: c.color }}
              />
              <span className="flex-1 truncate font-medium">{c.name}</span>
              <div className="flex gap-1">
                <button
                  className="btn-secondary px-2 py-1 text-xs"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                >
                  ↑
                </button>
                <button
                  className="btn-secondary px-2 py-1 text-xs"
                  onClick={() => move(i, 1)}
                  disabled={i === categories.length - 1}
                >
                  ↓
                </button>
                <button
                  className="btn-secondary px-2 py-1 text-xs"
                  onClick={() => onEdit(c)}
                >
                  수정
                </button>
                <button
                  className="btn-danger px-2 py-1 text-xs"
                  onClick={() => onDelete(c)}
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
