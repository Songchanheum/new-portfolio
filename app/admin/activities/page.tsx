"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { ActivityData } from '@/types'

type ToastState = { message: string; type: 'success' | 'error' } | null

const EMPTY_FORM = {
  title: '',
  date: '' as string,
  description: '',
  blogUrl: '',
  displayOrder: 0,
}

type FormState = typeof EMPTY_FORM

function dateForInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 10)
}

export default function AdminActivitiesPage() {
  const [items, setItems] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastState>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<FormState>(EMPTY_FORM)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function fetchItems() {
    try {
      const res = await fetch('/api/admin/activities')
      if (!res.ok) {
        const json = await res.json()
        showToast(json.error ?? '활동 조회 실패', 'error')
        return
      }
      const json = await res.json()
      setItems(json.data as ActivityData[])
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

  function payloadFromForm(f: FormState) {
    return {
      title: f.title,
      date: f.date.trim() ? f.date : null,
      description: f.description,
      blogUrl: f.blogUrl,
      displayOrder: f.displayOrder,
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.title.trim()) {
      showToast('제목은 필수입니다', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadFromForm(createForm)),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '활동 생성 실패', 'error')
        return
      }
      setItems((prev) => [...prev, json.data as ActivityData])
      setCreateForm(EMPTY_FORM)
      setShowCreateForm(false)
      showToast('활동이 생성되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(item: ActivityData) {
    setEditingId(item.id)
    setEditForm({
      title: item.title,
      date: dateForInput(item.date),
      description: item.description,
      blogUrl: item.blogUrl,
      displayOrder: item.displayOrder,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  async function handleSave(id: string) {
    if (!editForm.title.trim()) {
      showToast('제목은 필수입니다', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/activities/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadFromForm(editForm)),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '활동 수정 실패', 'error')
        return
      }
      setItems((prev) => prev.map((x) => (x.id === id ? (json.data as ActivityData) : x)))
      setEditingId(null)
      setEditForm(EMPTY_FORM)
      showToast('활동이 수정되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`"${title}" 활동을 삭제하시겠습니까?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/activities/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '활동 삭제 실패', 'error')
        return
      }
      setItems((prev) => prev.filter((x) => x.id !== id))
      showToast('활동이 삭제되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const inputClass =
    'w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm'

  return (
    <div className="p-8 relative">
      {toast && (
        <div
          className={cn(
            'fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg text-sm font-medium',
            toast.type === 'success' ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'
          )}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Activities 관리</h1>
          <p className="text-gray-400 text-sm mt-1">이력서 활동 (activities 테이블)</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreateForm((v) => !v)
            setCreateForm(EMPTY_FORM)
          }}
          className={cn(
            'px-4 py-2 rounded text-sm font-medium transition-colors',
            showCreateForm ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-900 hover:bg-gray-100'
          )}
        >
          {showCreateForm ? '취소' : '+ 새 활동'}
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-5 rounded-lg border border-gray-700 bg-gray-900 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-300">새 활동</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1">제목 *</label>
            <input
              className={inputClass}
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">일자</label>
              <input
                type="date"
                className={inputClass}
                value={createForm.date}
                onChange={(e) => setCreateForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">표시 순서</label>
              <input
                type="number"
                className={inputClass}
                value={createForm.displayOrder}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                }
                min={0}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">설명</label>
            <textarea
              className={cn(inputClass, 'resize-none')}
              rows={3}
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">블로그 URL</label>
            <input
              type="url"
              className={inputClass}
              value={createForm.blogUrl}
              onChange={(e) => setCreateForm((f) => ({ ...f, blogUrl: e.target.value }))}
              placeholder="https://"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded hover:bg-gray-800"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 text-sm bg-white text-gray-900 font-medium rounded hover:bg-gray-100 disabled:opacity-50"
            >
              {creating ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500 text-sm">불러오는 중...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 활동이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="p-5 rounded-lg border border-blue-700 bg-gray-900 space-y-4">
                <h3 className="text-xs font-semibold text-blue-400">수정 중</h3>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">제목 *</label>
                  <input
                    className={inputClass}
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">일자</label>
                    <input
                      type="date"
                      className={inputClass}
                      value={editForm.date}
                      onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">표시 순서</label>
                    <input
                      type="number"
                      className={inputClass}
                      value={editForm.displayOrder}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                      }
                      min={0}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">설명</label>
                  <textarea
                    className={cn(inputClass, 'resize-none')}
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">블로그 URL</label>
                  <input
                    type="url"
                    className={inputClass}
                    value={editForm.blogUrl}
                    onChange={(e) => setEditForm((f) => ({ ...f, blogUrl: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded hover:bg-gray-800"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSave(item.id)}
                    disabled={saving}
                    className="px-4 py-2 text-sm bg-white text-gray-900 font-medium rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    {saving ? '저장 중...' : '저장'}
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="flex items-start justify-between p-4 rounded-lg border border-gray-800 bg-gray-900 hover:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600 w-6 text-right shrink-0">{item.displayOrder}</span>
                    <span className="text-sm font-semibold text-white">{item.title}</span>
                  </div>
                  <div className="pl-8 text-xs text-gray-500 space-y-0.5">
                    {item.date && <p>일자: {dateForInput(item.date)}</p>}
                    {item.description && <p className="text-gray-600 line-clamp-2">{item.description}</p>}
                    {item.blogUrl && (
                      <a
                        href={item.blogUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 truncate block"
                      >
                        {item.blogUrl}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    disabled={editingId !== null || deletingId !== null}
                    className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded hover:bg-gray-800 disabled:opacity-40"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.title)}
                    disabled={deletingId === item.id || editingId !== null}
                    className={cn(
                      'px-3 py-1.5 text-xs rounded',
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
