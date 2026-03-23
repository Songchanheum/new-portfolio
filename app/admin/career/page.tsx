"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { CareerData } from '@/types'

// 토스트 상태 타입
type ToastState = {
  message: string
  type: 'success' | 'error'
} | null

// 생성/수정 폼 초기값
const EMPTY_FORM = {
  company: '',
  role: '',
  period: '',
  description: '',
  displayOrder: 0,
}

type FormState = typeof EMPTY_FORM

export default function AdminCareerPage() {
  const [items, setItems] = useState<CareerData[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>(null)

  // 생성 폼 상태
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>(EMPTY_FORM)
  const [creating, setCreating] = useState(false)

  // 수정 폼 상태 (null이면 수정 모드 아님)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  // 삭제 처리 중인 id
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // 토스트 표시 (3초 후 자동 제거)
  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // 경력 목록 조회
  async function fetchItems() {
    try {
      const res = await fetch('/api/admin/career')
      if (!res.ok) {
        const json = await res.json()
        showToast(json.error ?? '경력 목록 조회 실패', 'error')
        return
      }
      const json = await res.json()
      setItems(json.data as CareerData[])
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 새 경력 항목 생성
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.company.trim() || !createForm.role.trim() || !createForm.period.trim()) {
      showToast('회사명, 직무, 기간은 필수입니다', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin/career', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '경력 항목 생성 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 재조회 없이 로컬 상태에 추가
      setItems((prev) => [...prev, json.data as CareerData])
      setCreateForm(EMPTY_FORM)
      setShowCreateForm(false)
      showToast('경력 항목이 생성되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setCreating(false)
    }
  }

  // 수정 모드 진입
  function startEdit(item: CareerData) {
    setEditingId(item.id)
    setEditForm({
      company: item.company,
      role: item.role,
      period: item.period,
      description: item.description,
      displayOrder: item.displayOrder,
    })
  }

  // 수정 취소
  function cancelEdit() {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  // 경력 항목 수정 저장
  async function handleSave(id: string) {
    if (!editForm.company.trim() || !editForm.role.trim() || !editForm.period.trim()) {
      showToast('회사명, 직무, 기간은 필수입니다', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/career/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '경력 항목 수정 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 해당 항목만 교체
      setItems((prev) =>
        prev.map((item) => (item.id === id ? (json.data as CareerData) : item))
      )
      setEditingId(null)
      setEditForm(EMPTY_FORM)
      showToast('경력 항목이 수정되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // 경력 항목 삭제
  async function handleDelete(id: string, company: string) {
    if (!window.confirm(`"${company}" 경력 항목을 삭제하시겠습니까?`)) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/career/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '경력 항목 삭제 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 해당 항목 제거
      setItems((prev) => prev.filter((item) => item.id !== id))
      showToast('경력 항목이 삭제되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-8 relative">
      {/* 토스트 메시지 */}
      {toast && (
        <div
          className={cn(
            'fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-sm font-medium',
            toast.type === 'success'
              ? 'bg-green-800 text-green-100'
              : 'bg-red-800 text-red-100'
          )}
        >
          {toast.message}
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Career 관리</h1>
          <p className="text-gray-400 text-sm mt-1">경력 항목을 관리합니다</p>
        </div>
        <button
          onClick={() => {
            setShowCreateForm((v) => !v)
            setCreateForm(EMPTY_FORM)
          }}
          className={cn(
            'px-4 py-2 rounded text-sm font-medium transition-colors',
            showCreateForm
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-white text-gray-900 hover:bg-gray-100'
          )}
        >
          {showCreateForm ? '취소' : '+ 새 경력 추가'}
        </button>
      </div>

      {/* 새 경력 항목 생성 폼 */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-5 rounded-lg border border-gray-700 bg-gray-900"
        >
          <h2 className="text-sm font-semibold text-gray-300 mb-4">새 경력 추가</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">회사명 *</label>
              <input
                type="text"
                value={createForm.company}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, company: e.target.value }))
                }
                placeholder="회사명"
                required
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">직무 *</label>
              <input
                type="text"
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, role: e.target.value }))
                }
                placeholder="직무 / 포지션"
                required
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">기간 *</label>
              <input
                type="text"
                value={createForm.period}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, period: e.target.value }))
                }
                placeholder="예: 2022.03 — 2023.12"
                required
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">표시 순서</label>
              <input
                type="number"
                value={createForm.displayOrder}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                }
                min={0}
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">설명</label>
            <textarea
              value={createForm.description}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="경력 상세 설명 (선택)"
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm resize-none"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 text-sm bg-white text-gray-900 font-medium rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              {creating ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}

      {/* 경력 목록 */}
      {loading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">경력 항목이 없습니다. 새 경력을 추가해주세요.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            editingId === item.id ? (
              /* 인라인 수정 폼 */
              <div
                key={item.id}
                className="p-5 rounded-lg border border-blue-700 bg-gray-900"
              >
                <h3 className="text-xs font-semibold text-blue-400 mb-4">수정 중</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">회사명 *</label>
                    <input
                      type="text"
                      value={editForm.company}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, company: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">직무 *</label>
                    <input
                      type="text"
                      value={editForm.role}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, role: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">기간 *</label>
                    <input
                      type="text"
                      value={editForm.period}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, period: e.target.value }))
                      }
                      placeholder="예: 2022.03 — 2023.12"
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">표시 순서</label>
                    <input
                      type="number"
                      value={editForm.displayOrder}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                      }
                      min={0}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-1">설명</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(item.id)}
                    disabled={saving}
                    className="px-4 py-2 text-sm bg-white text-gray-900 font-medium rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                  >
                    {saving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            ) : (
              /* 경력 항목 표시 행 */
              <div
                key={item.id}
                className="flex items-start justify-between p-4 rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-700 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs text-gray-600 w-6 text-right shrink-0">
                      {item.displayOrder}
                    </span>
                    <span className="text-sm font-semibold text-white truncate">
                      {item.company}
                    </span>
                    <span className="text-xs text-gray-400 truncate">{item.role}</span>
                  </div>
                  <div className="pl-9">
                    <p className="text-xs text-gray-500 mb-1">{item.period}</p>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <button
                    onClick={() => startEdit(item)}
                    disabled={editingId !== null || deletingId !== null}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded hover:bg-gray-800 disabled:opacity-40 transition-colors"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.company)}
                    disabled={deletingId === item.id || editingId !== null}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded transition-colors',
                      deletingId === item.id
                        ? 'text-gray-600 bg-gray-800 cursor-not-allowed'
                        : 'text-red-400 hover:text-red-300 hover:bg-red-900/30 disabled:opacity-40'
                    )}
                  >
                    {deletingId === item.id ? '삭제 중...' : '삭제'}
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}
