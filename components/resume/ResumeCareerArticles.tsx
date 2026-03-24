import type { CareerDetailData } from '@/types'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'
import { ResumeRichText } from '@/components/resume/ResumeRichText'

type Props = {
  careers: CareerDetailData[]
  sectionClassName?: string
  title?: string
  printSectionTitle?: boolean
}

export default function ResumeCareerArticles({
  careers,
  sectionClassName = '',
  title = '경력 · Career',
  printSectionTitle = false,
}: Props) {
  return (
    <section className={`py-8 border-b border-gray-300 ${sectionClassName}`.trim()}>
      <ResumeSectionTitle printAvoidBreakAfter={printSectionTitle}>{title}</ResumeSectionTitle>
      <div className="space-y-8">
        {careers.map((career) => (
          <article key={career.id}>
            <header className="mb-3">
              <h3
                className="text-xl font-black resume-serif text-gray-900"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {career.company}
              </h3>
              <p className="text-sm font-medium text-[#1a5c38] mt-0.5">{career.role}</p>
              <p className="text-xs text-gray-500 mt-1">{career.period}</p>
            </header>
            <ResumeRichText html={career.description} className="text-sm leading-7" />
            <ResumeRichText html={career.detailDescription} className="text-sm leading-7 mt-3" />
            {career.achievements.length > 0 && (
              <ul className="mt-3 space-y-2 list-disc pl-5 text-sm text-gray-700 marker:text-[#1a5c38]">
                {career.achievements.map((a, i) => (
                  <li key={`${career.id}-ach-${i}`}>
                    <ResumeRichText html={a} className="text-sm leading-7 [&_p]:mb-1 [&_p:last-child]:mb-0" />
                  </li>
                ))}
              </ul>
            )}
            {career.careerTechStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {career.careerTechStack.map((tech) => (
                  <span key={tech} className="text-xs px-2 py-0.5 bg-[#e8f5ed] text-[#1a5c38] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  )
}
