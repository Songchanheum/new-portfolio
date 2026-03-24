'use client'

import { useMemo } from 'react'

import { sanitizeHtml } from '@/lib/wysiwyg'
import { cn } from '@/lib/utils'

type Props = {
  html: string | null | undefined
  className?: string
}

/**
 * 클라이언트에서 sanitize + innerHTML (WysiwygRenderer와 동일 경로).
 * 서버 RSC의 dangerouslySetInnerHTML만 쓰면 인쇄 미리보기/PDF에서 태그가 그대로 보이는 경우가 있어 클라이언트로 통일.
 */
export function ResumeRichText({ html, className }: Props) {
  const clean = useMemo(() => sanitizeHtml(html ?? ''), [html])
  const isEmpty = !clean.replace(/&nbsp;/gi, ' ').replace(/\s/g, '').length
  if (isEmpty) return null
  return (
    <div
      className={cn(
        'prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:marker:text-[#1a5c38]',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}
