import type { CareerDetailData } from '@/types'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'

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
            <p className="text-sm text-gray-700 leading-7">{career.description}</p>
            {career.detailDescription && (
              <p className="text-sm text-gray-700 leading-7 mt-3 whitespace-pre-line">{career.detailDescription}</p>
            )}
            {career.achievements.length > 0 && (
              <ul className="mt-3 space-y-1.5 list-disc pl-5 text-sm text-gray-700">
                {career.achievements.map((a) => (
                  <li key={a}>{a}</li>
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
