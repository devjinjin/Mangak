import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Category, Topic } from '../types'
import { getTopic, listCategories, saveCategory, saveTopic } from '../lib/db'
import { newReviewState } from '../lib/srs'

/** 이미지 파일을 읽어 최대 1600px로 리사이즈한 Data URL 반환 */
function readImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const src = reader.result as string
      const img = new Image()
      img.onload = () => {
        const MAX = 1600
        const scale = Math.min(1, MAX / Math.max(img.width, img.height))
        if (scale >= 1) {
          resolve(src)
          return
        }
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(src)
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.85))
      }
      img.onerror = () => reject(new Error('이미지를 읽을 수 없습니다.'))
      img.src = src
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export default function TopicEdit() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const fileRef = useRef<HTMLInputElement>(null)

  const [categories, setCategories] = useState<Category[]>([])
  const [original, setOriginal] = useState<Topic | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [tagsText, setTagsText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    listCategories().then(setCategories)
    if (id) {
      getTopic(id).then((t) => {
        if (!t) return
        setOriginal(t)
        setTitle(t.title)
        setDescription(t.description)
        setCategoryId(t.categoryId ?? '')
        setTagsText(t.tags.join(', '))
        setImages(t.images)
      })
    }
  }, [id])

  const onAddCategory = async () => {
    const name = window.prompt('새 카테고리 이름')?.trim()
    if (!name) return
    const PALETTE = [
      '#ef4444', '#f97316', '#eab308', '#22c55e',
      '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'
    ]
    const cat = {
      id: crypto.randomUUID(),
      name,
      color: PALETTE[categories.length % PALETTE.length],
      sortOrder: categories.length
        ? Math.max(...categories.map((c) => c.sortOrder)) + 1
        : 0,
      createdAt: new Date().toISOString()
    }
    await saveCategory(cat)
    const next = await listCategories()
    setCategories(next)
    setCategoryId(cat.id)
  }

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    try {
      const added: string[] = []
      for (const f of Array.from(files)) {
        added.push(await readImage(f))
      }
      setImages((prev) => [...prev, ...added])
    } catch {
      window.alert('이미지를 불러오지 못했습니다.')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i))
  }

  const moveImage = (i: number, dir: -1 | 1) => {
    setImages((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      const tmp = next[i]
      next[i] = next[j]
      next[j] = tmp
      return next
    })
  }

  const onSave = async () => {
    if (!title.trim()) {
      window.alert('제목을 입력하세요.')
      return
    }
    setSaving(true)
    const now = new Date().toISOString()
    const tags = tagsText
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean)
    const topic: Topic = original
      ? {
          ...original,
          title: title.trim(),
          description: description.trim(),
          categoryId: categoryId || null,
          tags,
          images,
          imageData: null,
          updatedAt: now
        }
      : {
          id: crypto.randomUUID(),
          title: title.trim(),
          description: description.trim(),
          categoryId: categoryId || null,
          tags,
          images,
          createdAt: now,
          updatedAt: now,
          review: newReviewState()
        }
    await saveTopic(topic)
    navigate(`/topics/${topic.id}`)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">{isEdit ? '토픽 수정' : '새 토픽 등록'}</h1>

      <div className="card space-y-4">
        <div>
          <label className="label">제목 *</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: OSI 7계층, CAP 정리, 옵저버 패턴"
          />
        </div>

        <div>
          <label className="label">설명 (정답 확인 시 함께 표시)</label>
          <textarea
            className="input min-h-28"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="핵심 키워드, 암기 포인트 등"
          />
        </div>

        <div>
          <label className="label">카테고리</label>
          <div className="flex gap-2">
            <select
              className="input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">미분류</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn-secondary shrink-0"
              onClick={onAddCategory}
            >
              + 추가
            </button>
          </div>
        </div>

        <div>
          <label className="label">태그 (쉼표로 구분)</label>
          <input
            className="input"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="네트워크, 토픽암기, 2교시"
          />
        </div>

        <div>
          <label className="label">
            정리 이미지 (도식 · 마인드맵 · A4 요약) — 여러 장 등록 가능
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          {images.length > 0 && (
            <ul className="space-y-2 mb-2">
              {images.map((img, i) => (
                <li
                  key={`${i}-${img.slice(-24)}`}
                  className="relative rounded-lg border border-slate-800 overflow-hidden"
                >
                  <img src={img} alt={`이미지 ${i + 1}`} className="w-full" />
                  <span className="absolute top-2 left-2 badge bg-slate-950/80 text-slate-300">
                    {i + 1} / {images.length}
                  </span>
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      className="btn-secondary px-2.5 py-1 text-xs"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      aria-label="위로 이동"
                    >
                      ↑
                    </button>
                    <button
                      className="btn-secondary px-2.5 py-1 text-xs"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      aria-label="아래로 이동"
                    >
                      ↓
                    </button>
                    <button
                      className="btn-danger px-2.5 py-1 text-xs"
                      onClick={() => removeImage(i)}
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <button
            className="w-full border border-dashed border-slate-700 rounded-lg py-6 text-sm text-slate-400 hover:border-sky-600 hover:text-sky-400"
            onClick={() => fileRef.current?.click()}
          >
            + 이미지 추가 (여러 장 선택 가능)
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="btn-primary flex-1 py-3" onClick={onSave} disabled={saving}>
          {isEdit ? '수정 저장' : '등록'}
        </button>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  )
}
