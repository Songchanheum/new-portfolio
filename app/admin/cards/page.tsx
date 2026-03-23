"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { CardData, CardType } from '@/types'

// 카드 타입 선택 옵션
const CARD_TYPE_OPTIONS: { value: CardType; label: string }[] = [
  { value: 'intro', label: 'Intro (소개)' },
  { value: 'developer', label: 'Developer (개발자)' },
  { value: 'career', label: 'Career (경력)' },
  { value: 'projects', label: 'Projects (프로젝트)' },
  { value: 'topic', label: 'Topic (주제)' },
]

// 토스트 상태 타입
type ToastState = {
  message: string
  type: 'success' | 'error'
} | null

// 생성/수정 폼 초기값
const EMPTY_FORM = {
  type: 'intro' as CardType,
  keyword: '',
  detail: '',
  displayOrder: 0,
}

type FormState = typeof EMPTY_FORM

export default function AdminCardsPage() {
  const [cards, setCards] = useState<CardData[]>([])
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

  // 카드 목록 조회
  async function fetchCards() {
    try {
      const res = await fetch('/api/admin/cards')
      if (!res.ok) {
        const json = await res.json()
        showToast(json.error ?? '카드 목록 조회 실패', 'error')
        return
      }
      const json = await res.json()
      setCards(json.data as CardData[])
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 새 카드 생성
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.keyword.trim()) {
      showToast('키워드를 입력해주세요', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '카드 생성 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 재조회 없이 로컬 상태에 추가
      setCards((prev) => [...prev, json.data as CardData])
      setCreateForm(EMPTY_FORM)
      setShowCreateForm(false)
      showToast('카드가 생성되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setCreating(false)
    }
  }

  // 수정 모드 진입
  function startEdit(card: CardData) {
    setEditingId(card.id)
    setEditForm({
      type: card.type,
      keyword: card.keyword,
      detail: card.detail,
      displayOrder: card.displayOrder,
    })
  }

  // 수정 취소
  function cancelEdit() {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  // 카드 수정 저장
  async function handleSave(id: string) {
    if (!editForm.keyword.trim()) {
      showToast('키워드를 입력해주세요', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '카드 수정 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 해당 카드만 교체
      setCards((prev) =>
        prev.map((c) => (c.id === id ? (json.data as CardData) : c))
      )
      setEditingId(null)
      setEditForm(EMPTY_FORM)
      showToast('카드가 수정되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // 카드 삭제
  async function handleDelete(id: string, keyword: string) {
    if (!window.confirm(`"${keyword}" 카드를 삭제하시겠습니까?`)) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/cards/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '카드 삭제 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 해당 카드 제거
      setCards((prev) => prev.filter((c) => c.id !== id))
      showToast('카드가 삭제되었습니다', 'success')
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
          <h1 className="text-2xl font-bold">Cards 관리</h1>
          <p className="text-gray-400 text-sm mt-1">캐러셀 카드 콘텐츠를 관리합니다</p>
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
          {showCreateForm ? '취소' : '+ 새 카드 추가'}
        </button>
      </div>

      {/* 새 카드 생성 폼 */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="mb-6 p-5 rounded-lg border border-gray-700 bg-gray-900"
        >
          <h2 className="text-sm font-semibold text-gray-300 mb-4">새 카드 추가</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">타입 *</label>
              <select
                value={createForm.type}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, type: e.target.value as CardType }))
                }
                className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
              >
                {CARD_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
            <label className="block text-xs text-gray-500 mb-1">키워드 *</label>
            <input
              type="text"
              value={createForm.keyword}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, keyword: e.target.value }))
              }
              placeholder="카드에 표시될 핵심 키워드"
              required
              className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-500 mb-1">상세 내용</label>
            <textarea
              value={createForm.detail}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, detail: e.target.value }))
              }
              placeholder="카드 상세 설명 (선택)"
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

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-gray-500 text-sm">카드 목록 로드 중...</div>
      )}

      {/* 빈 상태 */}
      {!loading && cards.length === 0 && (
        <div className="text-gray-600 text-sm py-12 text-center border border-gray-800 rounded-lg">
          카드가 없습니다. 새 카드를 추가해주세요.
        </div>
      )}

      {/* 카드 목록 */}
      {!loading && cards.length > 0 && (
        <div className="space-y-3">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border border-gray-700 bg-gray-900 overflow-hidden"
            >
              {/* 수정 모드 */}
              {editingId === card.id ? (
                <div className="p-5">
                  <h3 className="text-xs font-semibold text-gray-400 mb-4">카드 수정</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">타입 *</label>
                      <select
                        value={editForm.type}
                        onChange={(e) =>
                          setEditForm((f) => ({ ...f, type: e.target.value as CardType }))
                        }
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                      >
                        {CARD_TYPE_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">표시 순서</label>
                      <input
                        type="number"
                        value={editForm.displayOrder}
                        onChange={(e) =>
                          setEditForm((f) => ({
                            ...f,
                            displayOrder: Number(e.target.value),
                          }))
                        }
                        min={0}
                        className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">키워드 *</label>
                    <input
                      type="text"
                      value={editForm.keyword}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, keyword: e.target.value }))
                      }
                      required
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-xs text-gray-500 mb-1">상세 내용</label>
                    <textarea
                      value={editForm.detail}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, detail: e.target.value }))
                      }
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 text-sm resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded hover:bg-gray-800 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => handleSave(card.id)}
                      disabled={saving}
                      className="px-4 py-2 text-sm bg-white text-gray-900 font-medium rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      {saving ? '저장 중...' : '저장'}
                    </button>
                  </div>
                </div>
              ) : (
                /* 읽기 모드 */
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* 순서 배지 */}
                  <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 text-xs text-gray-400 font-mono">
                    {card.displayOrder}
                  </span>
                  {/* 타입 배지 */}
                  <span className="flex-shrink-0 text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 font-medium">
                    {card.type}
                  </span>
                  {/* 키워드 & 상세 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{card.keyword}</p>
                    {card.detail && (
                      <p className="text-xs text-gray-500 truncate mt-0.5">{card.detail}</p>
                    )}
                  </div>
                  {/* 액션 버튼 */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(card)}
                      disabled={editingId !== null || deletingId === card.id}
                      className="px-3 py-1.5 text-xs text-gray-400 hover:text-white rounded hover:bg-gray-800 disabled:opacity-40 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(card.id, card.keyword)}
                      disabled={deletingId === card.id || editingId === card.id}
                      className={cn(
                        'px-3 py-1.5 text-xs rounded transition-colors',
                        deletingId === card.id
                          ? 'text-gray-600 cursor-not-allowed'
                          : 'text-red-400 hover:text-red-300 hover:bg-red-950/50 disabled:opacity-40'
                      )}
                    >
                      {deletingId === card.id ? '삭제 중...' : '삭제'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
