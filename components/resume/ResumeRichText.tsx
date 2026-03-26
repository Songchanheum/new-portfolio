'use client'

import { cn } from '@/lib/utils'

type Props = {
  html: string | null | undefined
  className?: string
}

/**
 * 서버에서 sanitize된 HTML을 받아 innerHTML로 렌더링.
 * sanitize는 호출자(서버 컴포넌트)가 담당 — 이 컴포넌트는 렌더링만 수행.
 */
export function ResumeRichText({ html, className }: Props) {
  if (!html) return null
  const isEmpty = !html.replace(/<[^>]*>/g, '').replace(/&nbsp;/gi, ' ').replace(/\s/g, '').length
  if (isEmpty) return null
  return (
    <div
      className={cn(
        'prose prose-sm prose-gray max-w-none text-gray-700 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:my-2 [&_ol]:my-2 [&_li]:marker:text-[#1a5c38]',
        className,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
