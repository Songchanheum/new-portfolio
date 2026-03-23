import type { ReactNode } from 'react'
import { RESUME_MASTHEAD, RESUME_PERSONAL } from '@/components/resume/resume-copy'

type Personal = {
  birth: string
  address: string
  email: string
  phone: string
}

type Props = {
  /** 표지 우측 액션 (PDF 버튼 등) */
  actions?: ReactNode
  /**
   * personalVisibility: 'print-only' — 화면에선 숨기고 인쇄 시만 표시 (표지 페이지)
   * 'always' — 항상 표시 (전체 인쇄 페이지)
   */
  personalVisibility?: 'print-only' | 'always'
  personal?: Personal
  headerClassName?: string
}

const defaultPersonal: Personal = { ...RESUME_PERSONAL }

export default function ResumeMasthead({
  actions,
  personalVisibility = 'print-only',
  personal = defaultPersonal,
  headerClassName = '',
}: Props) {
  const personalBlock = (
    <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 grid grid-cols-2 gap-x-8 gap-y-1">
      <span>생년월일: {personal.birth}</span>
      <span>거주지: {personal.address}</span>
      <span>이메일: {personal.email}</span>
      <span>연락처: {personal.phone}</span>
    </div>
  )

  return (
    <header className={`border-t-4 border-[#1a5c38] pt-6 pb-5 ${headerClassName}`.trim()}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-5xl font-black tracking-tight leading-none mb-2 resume-serif"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {RESUME_MASTHEAD.name}
          </h1>
          <p className="text-lg font-medium text-[#1a5c38] tracking-wide mb-1">{RESUME_MASTHEAD.role}</p>
          <p className="text-sm text-gray-600 leading-relaxed max-w-md">{RESUME_MASTHEAD.bio}</p>
        </div>
        {actions ? <div className="flex flex-col items-end gap-2 shrink-0">{actions}</div> : null}
      </div>
      {personalVisibility === 'print-only' ? <div className="print-only">{personalBlock}</div> : personalBlock}
    </header>
  )
}
