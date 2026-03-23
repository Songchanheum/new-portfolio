"use client"

import { useState, useRef } from 'react'
import { cn } from '@/lib/utils'

// 업로드 결과 타입
interface UploadResult {
  total: number
  completed: number
  failed: number
  pending: number
}

// 토스트 상태 타입
type ToastType = 'success' | 'error'

interface Toast {
  id: number
  message: string
  type: ToastType
}

export default function ChatbotKbPage() {
  // 파일 입력 ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 폼 상태
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [chunkSize, setChunkSize] = useState<number>(500)
  const [overlap, setOverlap] = useState<number>(50)

  // 업로드 진행 상태
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null)

  // 토스트 목록
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  // ------- 토스트 헬퍼 -------

  function addToast(message: string, type: ToastType) {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, message, type }])
    // 3초 후 자동 제거
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3000)
  }

  function removeToast(id: number) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // ------- 파일 선택 핸들러 -------

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    setUploadResult(null)
  }

  // ------- 업로드 시작 핸들러 -------

  async function handleUpload() {
    if (!selectedFile) {
      addToast('파일을 선택해주세요', 'error')
      return
    }

    // 클라이언트 사이드 파일 검증
    const ext = selectedFile.name.split('.').pop()?.toLowerCase()
    if (ext !== 'txt' && ext !== 'md') {
      addToast('.txt 또는 .md 파일만 업로드할 수 있습니다', 'error')
      return
    }

    const MAX_SIZE = 1 * 1024 * 1024 // 1MB
    if (selectedFile.size > MAX_SIZE) {
      addToast(`파일 크기는 1MB 이하여야 합니다`, 'error')
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('chunkSize', String(chunkSize))
      formData.append('overlap', String(overlap))

      const res = await fetch('/api/admin/chatbot-kb/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json() as UploadResult & { error?: string }

      if (!res.ok) {
        addToast(data.error ?? '업로드 중 오류가 발생했습니다', 'error')
        return
      }

      setUploadResult(data)

      // 완료 토스트 표시
      if (data.failed === 0) {
        addToast(`완료: ${data.completed}개 성공`, 'success')
      } else {
        addToast(`완료: ${data.completed}개 성공, ${data.failed}개 실패`, 'error')
      }

      // 업로드 성공 후 파일 선택 초기화
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      addToast((err as Error).message ?? '네트워크 오류가 발생했습니다', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  // ------- 렌더링 -------

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Chatbot KB 관리</h1>

      {/* 파일 업로드 섹션 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">파일 업로드</h2>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-5">
          {/* 파일 선택 */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              파일 선택 <span className="text-gray-600">(.txt, .md / 최대 1MB)</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-300
                file:mr-4 file:py-1.5 file:px-3
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-gray-700 file:text-gray-200
                hover:file:bg-gray-600
                disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {selectedFile && (
              <p className="text-xs text-gray-500 mt-1">
                선택된 파일: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
              </p>
            )}
          </div>

          {/* 청크 설정 */}
          <div className="flex gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                청크 크기 <span className="text-gray-600">(단어 수)</span>
              </label>
              <input
                type="number"
                value={chunkSize}
                min={50}
                max={2000}
                onChange={e => setChunkSize(Math.max(1, parseInt(e.target.value, 10) || 500))}
                disabled={isUploading}
                className="w-28 px-3 py-1.5 bg-gray-800 text-white text-sm rounded border border-gray-700
                  focus:outline-none focus:border-gray-500 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                오버랩 <span className="text-gray-600">(단어 수)</span>
              </label>
              <input
                type="number"
                value={overlap}
                min={0}
                max={500}
                onChange={e => setOverlap(Math.max(0, parseInt(e.target.value, 10) || 50))}
                disabled={isUploading}
                className="w-28 px-3 py-1.5 bg-gray-800 text-white text-sm rounded border border-gray-700
                  focus:outline-none focus:border-gray-500 disabled:opacity-50"
              />
            </div>
          </div>

          {/* 업로드 버튼 */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleUpload}
              disabled={isUploading || !selectedFile}
              className={cn(
                'px-4 py-2 bg-white text-gray-900 text-sm font-medium rounded',
                'hover:bg-gray-100 transition-colors',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              {isUploading ? '처리 중...' : '업로드 시작'}
            </button>

            {/* 업로드 진행 상태 표시 */}
            {isUploading && (
              <p className="text-sm text-gray-400 animate-pulse">
                파일 분석 및 임베딩 처리 중 (최대 60초 소요)...
              </p>
            )}
          </div>

          {/* 업로드 결과 표시 */}
          {uploadResult && (
            <div className="mt-2 p-4 bg-gray-800 rounded border border-gray-700 text-sm">
              <p className="text-gray-300 font-medium mb-2">업로드 결과</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <dt className="text-gray-500">전체 청크</dt>
                <dd className="text-white">{uploadResult.total}개</dd>
                <dt className="text-gray-500">성공</dt>
                <dd className="text-green-400">{uploadResult.completed}개</dd>
                <dt className="text-gray-500">실패</dt>
                <dd className={cn(uploadResult.failed > 0 ? 'text-red-400' : 'text-gray-400')}>
                  {uploadResult.failed}개
                </dd>
                {uploadResult.pending > 0 && (
                  <>
                    <dt className="text-gray-500">대기 중</dt>
                    <dd className="text-yellow-400">{uploadResult.pending}개</dd>
                  </>
                )}
              </dl>
              {uploadResult.failed > 0 && (
                <p className="mt-2 text-xs text-gray-500">
                  실패한 청크는 Story 2.5 구현 후 선택 재시도할 수 있습니다.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* 청크 목록 섹션 — Story 2.3에서 구현 */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-300">청크 목록</h2>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-sm text-gray-500">
          청크 목록 조회 및 검색은 Story 2.3에서 구현됩니다.
        </div>
      </section>

      {/* 토스트 알림 */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={cn(
              'px-4 py-3 rounded-lg shadow-lg text-sm font-medium cursor-pointer',
              'transition-all duration-200 max-w-xs',
              toast.type === 'success'
                ? 'bg-green-900 text-green-200 border border-green-700'
                : 'bg-red-900 text-red-200 border border-red-700'
            )}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  )
}
