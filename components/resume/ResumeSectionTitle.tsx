import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  /** 인쇄 시 제목 뒤 페이지 나눔 완화 */
  printAvoidBreakAfter?: boolean
  className?: string
}

export default function ResumeSectionTitle({
  children,
  printAvoidBreakAfter = false,
  className = '',
}: Props) {
  return (
    <h2
      className={`text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-4 resume-serif ${printAvoidBreakAfter ? 'print-section-title' : ''} ${className}`.trim()}
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      {children}
    </h2>
  )
}
