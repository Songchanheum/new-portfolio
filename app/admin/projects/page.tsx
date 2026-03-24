"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import TiptapEditor from '@/components/wysiwyg/TiptapEditor'
import type { ProjectDetailData } from '@/types'

// 토스트 상태 타입
type ToastState = {
  message: string
  type: 'success' | 'error'
} | null

// 생성/수정 폼 상태 타입
// tech_stack은 폼에서 쉼표 구분 문자열로 관리, 전송 시 배열로 변환
type FormState = {
  title: string
  description: string
  detailDescription: string
  role: string
  period: string
  contributions: string
  techStackInput: string  // 폼 표시용 — "Next.js, React, TypeScript"
  thumbnailUrl: string
  projectUrl: string
  displayOrder: number
}

const EMPTY_FORM: FormState = {
  title: '',
  description: '',
  detailDescription: '',
  role: '',
  period: '',
  contributions: '',
  techStackInput: '',
  thumbnailUrl: '',
  projectUrl: '',
  displayOrder: 0,
}

// techStackInput(string) → string[] 변환
function parseTechStack(input: string): string[] {
  return input.split(',').map((s) => s.trim()).filter(Boolean)
}

// string[] → techStackInput(string) 변환
function joinTechStack(arr: string[]): string {
  return arr.join(', ')
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectDetailData[]>([])
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

  // 프로젝트 목록 조회
  async function fetchProjects() {
    try {
      const res = await fetch('/api/admin/projects')
      if (!res.ok) {
        const json = await res.json()
        showToast(json.error ?? '프로젝트 목록 조회 실패', 'error')
        return
      }
      const json = await res.json()
      setProjects(json.data as ProjectDetailData[])
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 새 프로젝트 생성
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!createForm.title.trim()) {
      showToast('제목을 입력해주세요', 'error')
      return
    }
    setCreating(true)
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          detailDescription: createForm.detailDescription,
          role: createForm.role,
          period: createForm.period,
          contributions: createForm.contributions,
          techStack: parseTechStack(createForm.techStackInput),
          thumbnailUrl: createForm.thumbnailUrl,
          projectUrl: createForm.projectUrl,
          displayOrder: createForm.displayOrder,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '프로젝트 생성 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 재조회 없이 로컬 상태에 추가
      setProjects((prev) => [...prev, json.data as ProjectDetailData])
      setCreateForm(EMPTY_FORM)
      setShowCreateForm(false)
      showToast('프로젝트가 생성되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setCreating(false)
    }
  }

  // 수정 모드 진입
  function startEdit(project: ProjectDetailData) {
    setEditingId(project.id)
    setEditForm({
      title: project.title,
      description: project.description,
      detailDescription: project.detailDescription,
      role: project.role,
      period: project.period,
      contributions: project.contributions,
      techStackInput: joinTechStack(project.techStack),
      thumbnailUrl: project.thumbnailUrl,
      projectUrl: project.projectUrl,
      displayOrder: project.displayOrder,
    })
  }

  // 수정 취소
  function cancelEdit() {
    setEditingId(null)
    setEditForm(EMPTY_FORM)
  }

  // 프로젝트 수정 저장
  async function handleSave(id: string) {
    if (!editForm.title.trim()) {
      showToast('제목을 입력해주세요', 'error')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          detailDescription: editForm.detailDescription,
          role: editForm.role,
          period: editForm.period,
          contributions: editForm.contributions,
          techStack: parseTechStack(editForm.techStackInput),
          thumbnailUrl: editForm.thumbnailUrl,
          projectUrl: editForm.projectUrl,
          displayOrder: editForm.displayOrder,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '프로젝트 수정 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 해당 프로젝트만 교체
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? (json.data as ProjectDetailData) : p))
      )
      setEditingId(null)
      setEditForm(EMPTY_FORM)
      showToast('프로젝트가 수정되었습니다', 'success')
    } catch (err) {
      showToast((err as Error).message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // 프로젝트 삭제
  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`"${title}" 프로젝트를 삭제하시겠습니까?`)) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) {
        showToast(json.error ?? '프로젝트 삭제 실패', 'error')
        return
      }
      // FR35: 즉시 목록 반영 — 해당 프로젝트 제거
      setProjects((prev) => prev.filter((p) => p.id !== id))
      showToast('프로젝트가 삭제되었습니다', 'success')
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
          <h1 className="text-2xl font-bold">Projects 관리</h1>
          <p className="text-gray-400 text-sm mt-1">포트폴리오 프로젝트를 관리합니다</p>
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
          {showCreateForm ? '취소' : '+ 새 프로젝트 추가'}
        </button>
      </div>

      {/* 새 프로젝트 생성 폼 */}
      {showCreateForm && (
        <form
          onSubmit={handleCreate}
          className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 space-y-4"
        >
          <h2 className="text-lg font-semibold mb-2">새 프로젝트</h2>

          {/* title */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              제목 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="프로젝트 제목"
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* description */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">설명</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="프로젝트 설명"
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">이력서 상세 본문</label>
            <TiptapEditor
              content={createForm.detailDescription}
              onChange={(html) => setCreateForm((f) => ({ ...f, detailDescription: html }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">담당 역할</label>
              <input
                type="text"
                value={createForm.role}
                onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value }))}
                placeholder="예: 프론트엔드 리드"
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">기간</label>
              <input
                type="text"
                value={createForm.period}
                onChange={(e) => setCreateForm((f) => ({ ...f, period: e.target.value }))}
                placeholder="예: 2024.01 — 2024.06"
                className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">기여 내용</label>
            <textarea
              value={createForm.contributions}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, contributions: e.target.value }))
              }
              placeholder="contributions — 기여·성과 요약"
              rows={3}
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
            />
          </div>

          {/* tech_stack */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              기술 스택{' '}
              <span className="text-gray-500 text-xs">(쉼표로 구분 — 예: Next.js, React, TypeScript)</span>
            </label>
            <input
              type="text"
              value={createForm.techStackInput}
              onChange={(e) => setCreateForm((f) => ({ ...f, techStackInput: e.target.value }))}
              placeholder="Next.js, React, TypeScript"
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* thumbnail_url */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">썸네일 URL</label>
            <input
              type="text"
              value={createForm.thumbnailUrl}
              onChange={(e) => setCreateForm((f) => ({ ...f, thumbnailUrl: e.target.value }))}
              placeholder="https://example.com/thumbnail.png"
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* project_url */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">프로젝트 URL</label>
            <input
              type="url"
              value={createForm.projectUrl}
              onChange={(e) => setCreateForm((f) => ({ ...f, projectUrl: e.target.value }))}
              placeholder="https://example.com/project"
              className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* display_order */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">표시 순서</label>
            <input
              type="number"
              value={createForm.displayOrder}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
              }
              className="w-32 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={creating}
              className={cn(
                'px-4 py-2 rounded text-sm font-medium transition-colors',
                creating
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-900 hover:bg-gray-100'
              )}
            >
              {creating ? '저장 중...' : '저장'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowCreateForm(false)
                setCreateForm(EMPTY_FORM)
              }}
              className="px-4 py-2 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {/* 프로젝트 목록 */}
      {loading ? (
        <p className="text-gray-400 text-sm">불러오는 중...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500 text-sm">등록된 프로젝트가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden"
            >
              {editingId === project.id ? (
                /* 수정 폼 (인라인) */
                <div className="p-6 space-y-4">
                  <h3 className="text-base font-semibold text-gray-200 mb-2">프로젝트 수정</h3>

                  {/* title */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      제목 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* description */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">설명</label>
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">이력서 상세 본문</label>
                    <TiptapEditor
                      content={editForm.detailDescription}
                      onChange={(html) => setEditForm((f) => ({ ...f, detailDescription: html }))}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">담당 역할</label>
                      <input
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">기간</label>
                      <input
                        type="text"
                        value={editForm.period}
                        onChange={(e) => setEditForm((f) => ({ ...f, period: e.target.value }))}
                        className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">기여 내용</label>
                    <textarea
                      value={editForm.contributions}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, contributions: e.target.value }))
                      }
                      rows={3}
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400 resize-none"
                    />
                  </div>

                  {/* tech_stack */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      기술 스택{' '}
                      <span className="text-gray-500 text-xs">(쉼표로 구분)</span>
                    </label>
                    <input
                      type="text"
                      value={editForm.techStackInput}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, techStackInput: e.target.value }))
                      }
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* thumbnail_url */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">썸네일 URL</label>
                    <input
                      type="text"
                      value={editForm.thumbnailUrl}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                      }
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* project_url */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">프로젝트 URL</label>
                    <input
                      type="url"
                      value={editForm.projectUrl}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, projectUrl: e.target.value }))
                      }
                      placeholder="https://example.com/project"
                      className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  {/* display_order */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">표시 순서</label>
                    <input
                      type="number"
                      value={editForm.displayOrder}
                      onChange={(e) =>
                        setEditForm((f) => ({ ...f, displayOrder: Number(e.target.value) }))
                      }
                      className="w-32 bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleSave(project.id)}
                      disabled={saving}
                      className={cn(
                        'px-4 py-2 rounded text-sm font-medium transition-colors',
                        saving
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-900 hover:bg-gray-100'
                      )}
                    >
                      {saving ? '저장 중...' : '저장'}
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 rounded text-sm font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                /* 읽기 모드 */
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-mono">#{project.displayOrder}</span>
                      <span className="font-semibold text-gray-100 truncate">{project.title}</span>
                    </div>
                    {project.description && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                    )}
                    {(project.role || project.period) && (
                      <p className="text-xs text-gray-500 mb-2">
                        {[project.role, project.period].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    {project.detailDescription && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{project.detailDescription}</p>
                    )}
                    {project.contributions && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">{project.contributions}</p>
                    )}
                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.thumbnailUrl && (
                      <p className="text-xs text-gray-500 truncate">{project.thumbnailUrl}</p>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 truncate block"
                      >
                        {project.projectUrl}
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => startEdit(project)}
                      className="px-3 py-1.5 rounded text-xs font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(project.id, project.title)}
                      disabled={deletingId === project.id}
                      className={cn(
                        'px-3 py-1.5 rounded text-xs font-medium transition-colors',
                        deletingId === project.id
                          ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          : 'bg-red-900 text-red-300 hover:bg-red-800'
                      )}
                    >
                      {deletingId === project.id ? '삭제 중...' : '삭제'}
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
