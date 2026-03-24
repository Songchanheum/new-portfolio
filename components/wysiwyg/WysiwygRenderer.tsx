"use client"

import { useMemo } from 'react'

import { sanitizeHtml } from '@/lib/wysiwyg'

interface WysiwygRendererProps {
  html: string | null | undefined
  className?: string
}

export function WysiwygRenderer({ html, className = 'prose prose-invert' }: WysiwygRendererProps) {
  const clean = useMemo(() => sanitizeHtml(html ?? ''), [html])
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}

export default WysiwygRenderer
