import type { ReactNode } from 'react'
import { Globe, FileText } from 'lucide-react'
import { RESUME_MASTHEAD, RESUME_PERSONAL, RESUME_LINKS } from '@/components/resume/resume-copy'

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
          <div className="flex items-center gap-4 mt-2 mb-3">
            {RESUME_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a5c38] transition-colors"
              >
                {label === 'GitHub' && (
                  <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden>
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                  </svg>
                )}
                {label === 'Portfolio' && <Globe    size={15} strokeWidth={1.5} />}
                {label === 'Resume'    && <FileText size={15} strokeWidth={1.5} />}
                <span className="underline underline-offset-2">{label}</span>
              </a>
            ))}
          </div>
          <div className="text-sm text-gray-600 leading-relaxed max-w-2xl space-y-2.5">
            {RESUME_MASTHEAD.bioParagraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
        {actions ? <div className="flex flex-col items-end gap-2 shrink-0">{actions}</div> : null}
      </div>
      {personalVisibility === 'print-only' ? <div className="print-only">{personalBlock}</div> : personalBlock}
    </header>
  )
}
