"use client"

import { useRef, useState } from 'react'
import type { Editor } from '@tiptap/react'
import type { ImageUploadResponse } from '@/types'

interface ImageUploadButtonProps {
  editor: Editor
}

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function ImageUploadButton({ editor }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)

    // 클라이언트 1차 검증
    if (!ALLOWED_MIME.includes(file.type)) {
      setError('jpg, png, webp, gif만 허용됩니다')
      return
    }
    if (file.size > MAX_SIZE) {
      setError('파일 크기가 5MB를 초과합니다')
      return
    }

    const alt = window.prompt('이미지 alt 텍스트를 입력하세요 (선택 사항)') ?? ''

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok || !json.data?.url) {
        setError(json.error ?? '업로드 실패')
        return
      }
      const { url } = json.data as ImageUploadResponse
      editor.chain().focus().setImage({ src: url, alt }).run()
    } catch {
      setError('업로드 중 오류가 발생했습니다')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-2 py-1 text-sm rounded hover:bg-white/10 disabled:opacity-50"
      >
        {uploading ? '업로드 중...' : '이미지'}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </div>
  )
}
