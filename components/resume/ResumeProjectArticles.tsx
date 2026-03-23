import type { ProjectDetailData } from '@/types'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'

type Props = {
  projects: ProjectDetailData[]
  sectionClassName?: string
  title?: string
  printSectionTitle?: boolean
}

export default function ResumeProjectArticles({
  projects,
  sectionClassName = '',
  title = '프로젝트 · Projects',
  printSectionTitle = false,
}: Props) {
  return (
    <section className={`py-8 border-b border-gray-300 ${sectionClassName}`.trim()}>
      <ResumeSectionTitle printAvoidBreakAfter={printSectionTitle}>{title}</ResumeSectionTitle>
      <div className="space-y-8">
        {projects.map((project) => (
          <article key={project.id}>
            <header className="mb-3">
              <h3
                className="text-xl font-black resume-serif text-gray-900"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                {project.title}
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                {project.role && <span className="font-medium text-[#1a5c38]">{project.role}</span>}
                {project.role && project.period && <span className="text-gray-300">|</span>}
                {project.period && <span>{project.period}</span>}
              </div>
              {project.projectUrl && (
                <p className="text-xs text-gray-400 mt-1 break-all">{project.projectUrl}</p>
              )}
            </header>
            <p className="text-sm text-gray-700 leading-7">{project.description}</p>
            {project.detailDescription && (
              <p className="text-sm text-gray-700 leading-7 mt-3 whitespace-pre-line">{project.detailDescription}</p>
            )}
            {project.contributions && (
              <p className="text-sm text-gray-700 leading-7 mt-3 whitespace-pre-line">{project.contributions}</p>
            )}
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {project.techStack.map((tech) => (
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
