"use client"

interface WysiwygRendererProps {
  html: string | null | undefined
  className?: string
}

export function WysiwygRenderer({ html, className = 'prose prose-invert' }: WysiwygRendererProps) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html ?? '' }} />
}

export default WysiwygRenderer
