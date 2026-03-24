"use client"

// 청크 목록 조회 + 검색 페이지 — Story 2.3
// FR26: 청크 목록 조회 / FR27: 청크 내용으로 검색
// NFR-P3: 1,000개 이하 3초 이내 로드 (embedding 제외, 50개 페이지네이션)

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// 청크 행 타입 — embedding 컬럼 제외
type ChunkRow = {
  id: string
  content: string        // 최대 200자 미리보기
  status: 'pending' | 'processing' | 'completed' | 'failed'
  source_file: string | null
  created_at: string
}

type ChunksApiResponse = {
  data: ChunkRow[]
  total: number
  page: number
  pageSize: number
}

// status 배지 스타일 맵 — cn() 대신 정적 매핑 사용 (조건 복잡도 방지)
const STATUS_BADGE: Record<ChunkRow['status'], string> = {
  completed: 'bg-green-900/40 text-green-300 border border-green-700',
  failed:    'bg-red-900/40 text-red-300 border border-red-700',
  pending:   'bg-yellow-900/40 text-yellow-300 border border-yellow-700',
  processing:'bg-blue-900/40 text-blue-300 border border-blue-700',
}

const STATUS_LABEL: Record<ChunkRow['status'], string> = {
  completed: 'completed',
  failed:    'failed',
  pending:   'pending',
  processing:'processing',
}

const PAGE_SIZE = 50

// useSearchParams는 Suspense 경계 필요 — 내부 컴포넌트로 분리
function ChunksPageInner() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL search params에서 초기 필터 값 읽기 (AC8: URL 기반 상태 유지)
  const [searchText, setSearchText] = useState(searchParams.get('search') ?? '')
  const [sourceFile, setSourceFile] = useState(searchParams.get('source_file') ?? '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') ?? '')
  const [currentPage, setCurrentPage] = useState(
    Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  )

  const [chunks, setChunks] = useState<ChunkRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 인라인 편집 상태
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  // 삭제 진행 중인 id 집합
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // 체크박스 선택 상태
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [bulkDeleting, setBulkDeleting] = useState(false)

  const allSelected = chunks.length > 0 && chunks.every(c => selectedIds.has(c.id))
  const someSelected = selectedIds.size > 0

  // 소스파일 드롭다운 옵션 — 목록에서 unique 값 추출
  const [sourceFileOptions, setSourceFileOptions] = useState<string[]>([])

  // URL을 현재 필터 상태로 업데이트하는 헬퍼
  const updateUrl = useCallback(
    (params: {
      search?: string
      source_file?: string
      status?: string
      page?: number
    }) => {
      const next = new URLSearchParams(searchParams.toString())

      if (params.search !== undefined) {
        params.search ? next.set('search', params.search) : next.delete('search')
      }
      if (params.source_file !== undefined) {
        params.source_file ? next.set('source_file', params.source_file) : next.delete('source_file')
      }
      if (params.status !== undefined) {
        params.status ? next.set('status', params.status) : next.delete('status')
      }
      if (params.page !== undefined) {
        params.page > 1 ? next.set('page', String(params.page)) : next.delete('page')
      }

      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  // API 호출 함수
  const fetchChunks = useCallback(async (opts: {
    search: string
    sourceFile: string
    status: string
    page: number
  }) => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (opts.search.trim())     params.set('search', opts.search.trim())
      if (opts.sourceFile.trim()) params.set('source_file', opts.sourceFile.trim())
      if (opts.status)            params.set('status', opts.status)
      params.set('page', String(opts.page))
      params.set('pageSize', String(PAGE_SIZE))

      const res = await fetch(`/api/admin/chatbot-kb/chunks?${params.toString()}`)

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: '알 수 없는 오류' }))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }

      const json: ChunksApiResponse = await res.json()
      setChunks(json.data)
      setTotal(json.total)
      setSelectedIds(new Set()) // 페이지 변경·검색 시 선택 초기화

      // source_file 드롭다운 옵션 갱신 — 현재 페이지 결과에서 unique 추출
      // (전체 목록에서 파일 목록을 별도 API로 조회하는 방식은 Story 2.5에서 필요 시 추가)
      setSourceFileOptions((prev) => {
        const newFiles = json.data
          .map((c) => c.source_file)
          .filter((f): f is string => !!f)
        const merged = Array.from(new Set([...prev, ...newFiles])).sort()
        return merged
      })
    } catch (err) {
      setError((err as Error).message)
      setChunks([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [])

  // 마운트 및 URL 변경 시 데이터 로드
  useEffect(() => {
    void fetchChunks({
      search: searchParams.get('search') ?? '',
      sourceFile: searchParams.get('source_file') ?? '',
      status: searchParams.get('status') ?? '',
      page: Math.max(1, parseInt(searchParams.get('page') ?? '1', 10)),
    })
  }, [searchParams, fetchChunks])

  // 검색 버튼 클릭 핸들러
  function handleSearch() {
    setCurrentPage(1)
    updateUrl({ search: searchText, source_file: sourceFile, status: statusFilter, page: 1 })
  }

  // 필터 초기화
  function handleReset() {
    setSearchText('')
    setSourceFile('')
    setStatusFilter('')
    setCurrentPage(1)
    updateUrl({ search: '', source_file: '', status: '', page: 1 })
  }

  // 페이지 변경
  function handlePageChange(next: number) {
    setCurrentPage(next)
    updateUrl({ page: next })
  }

  // 체크박스 토글
  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const s = new Set(prev)
      s.has(id) ? s.delete(id) : s.add(id)
      return s
    })
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(chunks.map(c => c.id)))
    }
  }

  // 일괄 삭제
  async function handleBulkDelete() {
    if (selectedIds.size === 0) return
    if (!window.confirm(`선택한 ${selectedIds.size}개 청크를 삭제하시겠습니까?`)) return
    setBulkDeleting(true)
    const ids = Array.from(selectedIds)
    await Promise.all(
      ids.map(id =>
        fetch(`/api/admin/chatbot-kb/chunks/${id}`, { method: 'DELETE' }).catch(() => null)
      )
    )
    setChunks(prev => prev.filter(c => !selectedIds.has(c.id)))
    setTotal(prev => prev - ids.length)
    setSelectedIds(new Set())
    setBulkDeleting(false)
  }

  // 삭제
  async function handleDelete(id: string) {
    if (!window.confirm('이 청크를 삭제하시겠습니까?')) return
    setDeletingIds(prev => new Set(prev).add(id))
    try {
      const res = await fetch(`/api/admin/chatbot-kb/chunks/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: '삭제 실패' }))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      setChunks(prev => prev.filter(c => c.id !== id))
      setTotal(prev => prev - 1)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setDeletingIds(prev => { const s = new Set(prev); s.delete(id); return s })
    }
  }

  // 수정 모드 진입
  function handleEdit(id: string, content: string) {
    setEditingId(id)
    setEditingContent(content)
  }

  // 수정 저장
  async function handleEditSave(id: string) {
    if (editingContent.trim() === '') return
    setEditSaving(true)
    try {
      const res = await fetch(`/api/admin/chatbot-kb/chunks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editingContent.trim() }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: '수정 실패' }))
        throw new Error(body.error ?? `HTTP ${res.status}`)
      }
      const json = await res.json()
      const updated = json.data as ChunkRow
      setChunks(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c))
      setEditingId(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setEditSaving(false)
    }
  }

  function handleEditCancel() {
    setEditingId(null)
    setEditingContent('')
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* 헤더 영역 */}
      <div className="flex items-center gap-4 mb-6">
        {/* 뒤로가기 링크 — /admin/chatbot-kb (AC10) */}
        <Link
          href="/admin/chatbot-kb"
          className="text-gray-400 hover:text-white text-sm transition-colors"
        >
          ← Chatbot KB
        </Link>
        <h1 className="text-2xl font-bold">청크 목록</h1>
        <div className="ml-auto flex items-center gap-3">
          {someSelected && (
            <button
              onClick={handleBulkDelete}
              disabled={bulkDeleting}
              className="px-3 py-1.5 text-sm bg-red-700 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {bulkDeleting ? '삭제 중...' : `선택 삭제 (${selectedIds.size})`}
            </button>
          )}
          {total > 0 && (
            <span className="text-sm text-gray-400">
              총 {total.toLocaleString()}개
            </span>
          )}
        </div>
      </div>

      {/* 검색/필터 영역 */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* 텍스트 검색 */}
          <div className="flex-1 min-w-48">
            <label className="block text-xs text-gray-400 mb-1">텍스트 검색</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
              placeholder="청크 내용 검색..."
              className="w-full px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:outline-none focus:border-gray-500 placeholder-gray-600"
            />
          </div>

          {/* 소스파일 드롭다운 */}
          <div className="min-w-44">
            <label className="block text-xs text-gray-400 mb-1">소스파일</label>
            <select
              value={sourceFile}
              onChange={(e) => setSourceFile(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:outline-none focus:border-gray-500"
            >
              <option value="">전체 파일</option>
              {sourceFileOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* 상태 드롭다운 */}
          <div className="min-w-36">
            <label className="block text-xs text-gray-400 mb-1">상태</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-700 focus:outline-none focus:border-gray-500"
            >
              <option value="">전체 상태</option>
              <option value="completed">completed</option>
              <option value="pending">pending</option>
              <option value="processing">processing</option>
              <option value="failed">failed</option>
            </select>
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
              검색
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-gray-300 text-sm rounded hover:bg-gray-700 disabled:opacity-50 transition-colors"
            >
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* 로딩 상태 */}
      {loading && (
        <div className="text-center py-12 text-gray-400">
          <span className="animate-pulse">청크 목록 로딩 중...</span>
        </div>
      )}

      {/* 에러 상태 */}
      {!loading && error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg p-4 mb-4 text-sm">
          오류: {error}
        </div>
      )}

      {/* 빈 상태 (AC9) */}
      {!loading && !error && chunks.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">청크가 없습니다.</p>
          <p className="text-sm">
            {searchText || sourceFile || statusFilter
              ? '검색 조건에 맞는 청크가 없습니다. 조건을 변경해 보세요.'
              : 'Story 2.2에서 파일을 업로드하면 청크가 생성됩니다.'}
          </p>
        </div>
      )}

      {/* 청크 목록 테이블 */}
      {!loading && !error && chunks.length > 0 && (
        <>
          <div className="border border-gray-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800">
                  <th className="w-10 px-3 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="cursor-pointer accent-white"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-gray-400 font-medium">내용 미리보기</th>
                  <th className="w-28 px-4 py-3 text-left text-gray-400 font-medium">상태</th>
                  <th className="w-40 px-4 py-3 text-left text-gray-400 font-medium">소스파일</th>
                  <th className="w-36 px-4 py-3 text-left text-gray-400 font-medium">생성일시</th>
                  <th className="w-24 px-4 py-3 text-left text-gray-400 font-medium">액션</th>
                </tr>
              </thead>
              <tbody>
                {chunks.map((chunk) => (
                  <tr
                    key={chunk.id}
                    className={cn(
                      'border-b border-gray-800/60 transition-colors hover:bg-gray-800/30',
                      // failed 상태 행 강조 (AC5, AC6)
                      chunk.status === 'failed' && 'bg-red-950/20'
                    )}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(chunk.id)}
                        onChange={() => toggleSelect(chunk.id)}
                        className="cursor-pointer accent-white"
                      />
                    </td>

                    {/* content 미리보기 or 인라인 편집 */}
                    <td className="px-4 py-3 text-gray-200">
                      {editingId === chunk.id ? (
                        <textarea
                          value={editingContent}
                          onChange={(e) => setEditingContent(e.target.value)}
                          disabled={editSaving}
                          rows={4}
                          className="w-full px-2 py-1.5 bg-gray-800 text-white text-sm rounded border border-gray-600 focus:outline-none focus:border-gray-400 resize-y disabled:opacity-50"
                        />
                      ) : (
                        <>
                          <p className="line-clamp-2 leading-relaxed">{chunk.content}</p>
                          <p className="text-xs text-gray-600 mt-1 font-mono">id: {chunk.id}</p>
                        </>
                      )}
                    </td>

                    {/* status badge (AC5) */}
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                          STATUS_BADGE[chunk.status]
                        )}
                      >
                        {STATUS_LABEL[chunk.status]}
                      </span>
                    </td>

                    {/* source_file */}
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {chunk.source_file ? (
                        <span className="truncate block max-w-36" title={chunk.source_file}>
                          {chunk.source_file}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>

                    {/* created_at */}
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(chunk.created_at).toLocaleString('ko-KR', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* 액션 버튼 */}
                    <td className="px-4 py-3">
                      {editingId === chunk.id ? (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditSave(chunk.id)}
                            disabled={editSaving || editingContent.trim() === ''}
                            className="px-2 py-1 text-xs text-white bg-blue-700 hover:bg-blue-600 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {editSaving ? '저장 중...' : '저장'}
                          </button>
                          <button
                            onClick={handleEditCancel}
                            disabled={editSaving}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(chunk.id, chunk.content)}
                            disabled={deletingIds.has(chunk.id)}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-40"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(chunk.id)}
                            disabled={deletingIds.has(chunk.id)}
                            className="px-2 py-1 text-xs text-gray-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {deletingIds.has(chunk.id) ? '삭제 중...' : '삭제'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 (AC7) */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-400">
                {((currentPage - 1) * PAGE_SIZE + 1).toLocaleString()}–
                {Math.min(currentPage * PAGE_SIZE, total).toLocaleString()} / {total.toLocaleString()}개
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1 || loading}
                  className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>
                {/* 페이지 번호 버튼 — 최대 5개 표시 */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4))
                  const page = startPage + i
                  if (page > totalPages) return null
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={cn(
                        'px-3 py-1 text-sm rounded transition-colors disabled:opacity-40',
                        page === currentPage
                          ? 'bg-white text-gray-900 font-medium'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages || loading}
                  className="px-3 py-1 text-sm bg-gray-800 text-gray-300 rounded hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// Suspense 래퍼 — useSearchParams는 Suspense 경계 필요
export default function ChunksPage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-gray-400">
        <span className="animate-pulse">페이지 로딩 중...</span>
      </div>
    }>
      <ChunksPageInner />
    </Suspense>
  )
}
