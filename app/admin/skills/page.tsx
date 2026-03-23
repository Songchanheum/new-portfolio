"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { SkillData } from '@/types'

type ToastState = { message: string; type: 'success' | 'error' } | null

const EMPTY_FORM = {
  name: '',
  category: '',
  proficiency: '',
  context: '',
  displayOrder: 0,
}

type FormState = typeof EMPTY_FORM

export default function AdminSkillsPage() {
  const [items, setItems] = useState<SkillData[]>([])
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
      const res = await fetch('/api/admin/skills')
      if (!res.ok) {
        const json = await res.json()
        showToast(json.error ?? 'Skills 조회 실패', 'error')
        return
      }
      const json = await res.json()
      setItems(json.data as SkillData[])
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

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.name.trim()) {
      showToast('스킬 이름은 필수입니다', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createForm.name,
          category: createForm.category,
          proficiency: createForm.proficiency,
          context: createForm.context,
          displayOrder: createForm.displayOrder,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '스킬 생성 실패', 'error')
        return
      }
      setItems((prev) => [...prev, json.data as SkillData])
      setCreateForm(EMPTY_FORM)
      setShowCreateForm(false)
      showToast('스킬이 생성되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setCreating(false)
    }
  }

  function startEdit(item: SkillData) {
    setEditingId(item.id)
    setEditForm({
      name: item.name,
      category: item.category,
      proficiency: item.proficiency,
      context: item.context,
      displayOrder: item.displayOrder,
    })
  }

  function cancelEdit() {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  async function handleSave(id: string) {
    if (!editForm.name.trim()) {
      showToast('스킬 이름은 필수입니다', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/skills/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          category: editForm.category,
          proficiency: editForm.proficiency,
          context: editForm.context,
          displayOrder: editForm.displayOrder,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '스킬 수정 실패', 'error')
        return
      }
      setItems((prev) => prev.map((x) => (x.id === id ? (json.data as SkillData) : x)))
      setEditingId(null)
      setEditForm(EMPTY_FORM)
      showToast('스킬이 수정되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`"${name}" 스킬을 삭제하시겠습니까?`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/skills/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '스킬 삭제 실패', 'error')
        return
      }
      setItems((prev) => prev.filter((x) => x.id !== id))
      showToast('스킬이 삭제되었습니다', 'success')
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
          <h1 className="text-2xl font-bold">Skills 관리</h1>
          <p className="text-gray-400 text-sm mt-1">이력서 스킬 항목 (resume-migration의 skills 테이블)</p>
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
          {showCreateForm ? '취소' : '+ 새 스킬'}
        </button>
      </div>

      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-5 rounded-lg border border-gray-700 bg-gray-900 space-y-4"
        >
          <h2 className="text-sm font-semibold text-gray-300">새 스킬</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">이름 *</label>
              <input
                className={inputClass}
                value={createForm.name}
                onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="예: TypeScript"
                required
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">카테고리</label>
              <input
                className={inputClass}
                value={createForm.category}
                onChange={(e) => setCreateForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="frontend, backend, devops, etc"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">숙련도</label>
              <input
                className={inputClass}
                value={createForm.proficiency}
                onChange={(e) => setCreateForm((f) => ({ ...f, proficiency: e.target.value }))}
                placeholder="expert, advanced, intermediate"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">맥락</label>
            <textarea
              className={cn(inputClass, 'resize-none')}
              rows={2}
              value={createForm.context}
              onChange={(e) => setCreateForm((f) => ({ ...f, context: e.target.value }))}
              placeholder="경험 요약 (선택)"
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
        <p className="text-gray-500 text-sm">등록된 스킬이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) =>
            editingId === item.id ? (
              <div key={item.id} className="p-5 rounded-lg border border-blue-700 bg-gray-900 space-y-4">
                <h3 className="text-xs font-semibold text-blue-400">수정 중</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">이름 *</label>
                    <input
                      className={inputClass}
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">카테고리</label>
                    <input
                      className={inputClass}
                      value={editForm.category}
                      onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">숙련도</label>
                    <input
                      className={inputClass}
                      value={editForm.proficiency}
                      onChange={(e) => setEditForm((f) => ({ ...f, proficiency: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">맥락</label>
                  <textarea
                    className={cn(inputClass, 'resize-none')}
                    rows={2}
                    value={editForm.context}
                    onChange={(e) => setEditForm((f) => ({ ...f, context: e.target.value }))}
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
                    <span className="text-sm font-semibold text-white">{item.name}</span>
                    {item.category && (
                      <span className="text-xs text-gray-500 px-2 py-0.5 rounded bg-gray-800">{item.category}</span>
                    )}
                    {item.proficiency && (
                      <span className="text-xs text-gray-400">{item.proficiency}</span>
                    )}
                  </div>
                  {item.context && <p className="text-xs text-gray-600 pl-8 line-clamp-2">{item.context}</p>}
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
                    onClick={() => handleDelete(item.id, item.name)}
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
