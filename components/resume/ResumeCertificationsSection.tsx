import type { CertificationData } from '@/types'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'
import { formatResumeYearMonth } from '@/components/resume/resume-format'

type Props = {
  certifications: CertificationData[]
  sectionClassName?: string
  title?: string
  printSectionTitle?: boolean
  emptyMessage?: string
}

export default function ResumeCertificationsSection({
  certifications,
  sectionClassName = '',
  title = '자격증 · Certifications',
  printSectionTitle = false,
  emptyMessage = '등록된 자격증이 없습니다.',
}: Props) {
  return (
    <section className={`py-8 border-b border-gray-300 ${sectionClassName}`.trim()}>
      <ResumeSectionTitle printAvoidBreakAfter={printSectionTitle}>{title}</ResumeSectionTitle>
      {certifications.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="space-y-0">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id}
              className={`py-4 ${idx < certifications.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex gap-6 items-start">
                <div className="w-24 shrink-0">
                  <p className="text-xs text-gray-400">{formatResumeYearMonth(cert.issuedAt)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base font-bold text-gray-900 resume-serif"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {cert.name}
                  </h3>
                  {cert.issuedBy && (
                    <p className="text-xs font-medium text-[#1a5c38] mt-0.5">{cert.issuedBy}</p>
                  )}
                  {cert.description && (
                    <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{cert.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
