import Link from 'next/link'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'
import { RESUME_INDEX_NAV } from '@/components/resume/resume-copy'

type NavItem = (typeof RESUME_INDEX_NAV)[number]

type Props = {
  /** 기본: 표지용 링크 + 인쇄 전용 정적 카드 */
  mode?: 'hub' | 'static'
  items?: readonly NavItem[]
  sectionClassName?: string
  title?: string
  printSectionTitle?: boolean
}

export default function ResumeIndexSection({
  mode = 'hub',
  items = RESUME_INDEX_NAV,
  sectionClassName = '',
  title = 'Index',
  printSectionTitle = false,
}: Props) {
  const cardInner = (s: NavItem) => (
    <>
      <div>
        <p className="text-base font-semibold text-gray-900">{s.label}</p>
        <p className="text-xs text-gray-400 tracking-wider">{s.sub}</p>
      </div>
      <span className="text-[#1a5c38] text-lg">→</span>
    </>
  )

  return (
    <section className={`py-6 ${sectionClassName}`.trim()}>
      <ResumeSectionTitle printAvoidBreakAfter={printSectionTitle}>{title}</ResumeSectionTitle>

      {mode === 'hub' && (
        <>
          <div className="grid grid-cols-2 gap-4">
            {items.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="no-print group flex items-center justify-between border border-gray-200 px-5 py-4 hover:border-[#1a5c38] hover:bg-[#e8f5ed] transition-colors"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900 group-hover:text-[#1a5c38]">{s.label}</p>
                  <p className="text-xs text-gray-400 tracking-wider">{s.sub}</p>
                </div>
                <span className="text-[#1a5c38] text-lg">→</span>
              </Link>
            ))}
          </div>
          <div className="print-only grid grid-cols-2 gap-4 mt-2">
            {items.map((s) => (
              <div
                key={s.href}
                className="print-avoid-break flex items-center justify-between border border-gray-200 px-5 py-4 bg-white"
              >
                {cardInner(s)}
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'static' && (
        <div className="grid grid-cols-2 gap-4">
          {items.map((s) => (
            <div
              key={s.id}
              className="print-avoid-break flex items-center justify-between border border-gray-200 px-5 py-4 bg-white"
            >
              {cardInner(s)}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
