import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { ProjectDetailData } from '@/types'
import ProjectPortfolioPDFButton from '@/components/resume/ProjectPortfolioPDFButton'

export const dynamic = 'force-dynamic'

async function fetchProjects(): Promise<ProjectDetailData[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, tech_stack, thumbnail_url, project_url, detail_description, role, period, contributions, display_order')
      .order('display_order')
    if (error || !data) return []
    return data.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      techStack: r.tech_stack ?? [],
      thumbnailUrl: r.thumbnail_url ?? '',
      projectUrl: r.project_url ?? '',
      displayOrder: r.display_order,
      detailDescription: r.detail_description ?? '',
      role: r.role ?? '',
      period: r.period ?? '',
      contributions: r.contributions ?? '',
    }))
  } catch {
    return []
  }
}

export default async function ProjectsHubPage() {
  const projects = await fetchProjects()

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      <div className="max-w-[794px] mx-auto px-8 py-10">

        {/* 헤더 */}
        <header className="border-t-4 border-[#1a5c38] pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-1 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                송찬흠 · Resume
              </p>
              <h1 className="text-3xl font-black tracking-tight resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                프로젝트
              </h1>
            </div>
            <div className="no-print flex items-center gap-3">
              <ProjectPortfolioPDFButton />
              <Link href="/resume" className="text-xs text-gray-400 hover:text-[#1a5c38] transition-colors">
                ← 표지로
              </Link>
            </div>
          </div>
        </header>

        <hr className="border-gray-300 mb-8" />

        {/* 프로젝트 목록 */}
        <section className="space-y-0">
          {projects.map((project, idx) => (
            <div key={project.id}>
              <Link
                href={`/resume/project/${project.id}`}
                className="no-print group flex gap-5 py-6 hover:bg-gray-50 -mx-4 px-4 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#1a5c38] transition-colors resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                      {project.title}
                    </h2>
                    {project.period && (
                      <span className="text-xs text-gray-400 shrink-0 mt-1">{project.period}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="text-xs px-2 py-0.5 bg-[#e8f5ed] text-[#1a5c38] font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-gray-300 group-hover:text-[#1a5c38] transition-colors self-center no-print">→</span>
              </Link>

              {/* print 전용 */}
              <div className="print-only py-5 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-base font-bold resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>{project.title}</h2>
                  {project.period && <span className="text-xs text-gray-500">{project.period}</span>}
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{project.description}</p>
                {project.techStack.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{project.techStack.join(' · ')}</p>
                )}
              </div>

              {idx < projects.length - 1 && <hr className="border-gray-100 no-print" />}
            </div>
          ))}
        </section>

      </div>
    </main>
  )
}
