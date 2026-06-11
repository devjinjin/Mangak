import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearAll, exportData, importData } from '../lib/db'
import type { ExportData } from '../types'

export default function Settings() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [mode, setMode] = useState<'merge' | 'overwrite'>('merge')
  const [busy, setBusy] = useState(false)

  const onExport = async () => {
    setBusy(true)
    try {
      const data = await exportData()
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const stamp = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `techmaster-recall-${stamp}.json`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setBusy(false)
    }
  }

  const onImportFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    try {
      const text = await file.text()
      const data = JSON.parse(text) as ExportData
      if (
        mode === 'overwrite' &&
        !window.confirm('기존 데이터를 모두 지우고 가져옵니다. 계속할까요?')
      ) {
        return
      }
      const r = await importData(data, mode)
      window.alert(
        `가져오기 완료\n카테고리 ${r.categories} · 토픽 ${r.topics} · 복습이력 ${r.reviewLogs}`
      )
      location.reload()
    } catch (e) {
      window.alert(`가져오기 실패: ${e instanceof Error ? e.message : '알 수 없는 오류'}`)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const onReset = async () => {
    if (!window.confirm('모든 데이터(토픽 · 카테고리 · 복습 이력)를 삭제합니다. 계속할까요?'))
      return
    if (!window.confirm('정말 삭제할까요? 되돌릴 수 없습니다. Export로 백업해 두는 것을 권장합니다.'))
      return
    await clearAll()
    window.alert('초기화되었습니다.')
    location.reload()
  }

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">설정</h1>

      <section className="card space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">카테고리 관리</h2>
        <p className="text-xs text-slate-500">카테고리 생성 · 수정 · 삭제 · 정렬 · 색상</p>
        <Link to="/categories" className="btn-secondary w-full">
          카테고리 관리 열기
        </Link>
      </section>

      <section className="card space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">데이터 내보내기 (Export)</h2>
        <p className="text-xs text-slate-500">
          카테고리 · 토픽 · 복습 상태 · 복습 이력을 JSON 파일로 저장합니다.
        </p>
        <button className="btn-primary w-full" onClick={onExport} disabled={busy}>
          JSON 내보내기
        </button>
      </section>

      <section className="card space-y-2">
        <h2 className="text-sm font-semibold text-slate-300">데이터 가져오기 (Import)</h2>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={mode === 'merge'}
              onChange={() => setMode('merge')}
            />
            병합
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={mode === 'overwrite'}
              onChange={() => setMode('overwrite')}
            />
            덮어쓰기
          </label>
        </div>
        {/* accept를 지정하면 일부 모바일 브라우저가 사진 선택기를 띄우는 문제가 있어
            파일 형식 제한 없이 받고, 내용(JSON 파싱 + 구조 검증)으로 검사한다 */}
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => onImportFile(e.target.files?.[0])}
        />
        <button
          className="btn-secondary w-full"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          JSON 파일 선택
        </button>
      </section>

      <section className="card space-y-2">
        <h2 className="text-sm font-semibold text-rose-400">데이터 초기화</h2>
        <p className="text-xs text-slate-500">모든 로컬 데이터를 삭제합니다. 되돌릴 수 없습니다.</p>
        <button className="btn-danger w-full" onClick={onReset} disabled={busy}>
          전체 데이터 삭제
        </button>
      </section>

      <p className="text-center text-xs text-slate-600">
        TechMaster Recall · 모든 데이터는 이 기기의 IndexedDB에만 저장됩니다.
      </p>
    </div>
  )
}
