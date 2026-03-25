import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import { sanitizeHtml } from '@/lib/wysiwyg'
import { WysiwygRenderer } from '@/components/wysiwyg/WysiwygRenderer'
import type { ProjectDetailData } from '@/types'

export const dynamic = 'force-dynamic'

async function fetchProject(id: string): Promise<ProjectDetailData | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, tech_stack, thumbnail_url, project_url, detail_description, role, period, contributions, display_order')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      techStack: data.tech_stack ?? [],
      thumbnailUrl: data.thumbnail_url ?? '',
      projectUrl: data.project_url ?? '',
      displayOrder: data.display_order,
      detailDescription: data.detail_description ?? '',
      role: data.role ?? '',
      period: data.period ?? '',
      contributions: data.contributions ?? '',
    }
  } catch {
    return null
  }
}

async function fetchAdjacentProjects(displayOrder: number) {
  try {
    const supabase = await createSupabaseServerClient()
    const [prevRes, nextRes] = await Promise.all([
      supabase
        .from('projects')
        .select('id, title, display_order')
        .lt('display_order', displayOrder)
        .order('display_order', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('projects')
        .select('id, title, display_order')
        .gt('display_order', displayOrder)
        .order('display_order')
        .limit(1)
        .single(),
    ])
    return { prev: prevRes.data ?? null, next: nextRes.data ?? null }
  } catch {
    return { prev: null, next: null }
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await fetchProject(id)
  if (!project) notFound()

  const { prev, next } = await fetchAdjacentProjects(project.displayOrder)

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      <div className="max-w-[794px] mx-auto px-8 py-10">

        {/* 헤더 */}
        <header className="border-t-4 border-[#1a5c38] pt-6 pb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              송찬흠 · Projects
            </p>
            <Link href="/resume/projects" className="no-print text-xs text-gray-400 hover:text-[#1a5c38] transition-colors">
              ← 프로젝트 목록
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight resume-serif mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
            {project.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            {project.role && <span className="text-sm font-medium text-[#1a5c38]">{project.role}</span>}
            {project.role && project.period && <span className="text-gray-300">|</span>}
            {project.period && <span className="text-sm text-gray-500">{project.period}</span>}
            {project.projectUrl && (
              <>
                <span className="text-gray-300">|</span>
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1a5c38] underline underline-offset-2 hover:opacity-70 no-print"
                >
                  프로젝트 링크 ↗
                </a>
              </>
            )}
          </div>
        </header>

        <hr className="border-gray-300 mb-8" />

        {/* 프로젝트 개요 */}
        <section className="mb-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
            Overview
          </h2>
          <p className="text-sm text-gray-700 leading-7">{project.description}</p>
        </section>

        {/* 상세 설명 */}
        {project.detailDescription && (
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              상세 내용
            </h2>
            <WysiwygRenderer
              html={sanitizeHtml(project.detailDescription)}
              className="prose prose-sm max-w-none text-gray-700 [&_li_p]:my-0"
            />
          </section>
        )}

        {/* 기여 내용 */}
        {project.contributions && (
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              기여 내용
            </h2>
            <WysiwygRenderer html={project.contributions} className="text-sm leading-7 [&_li]:my-0 [&_li_p]:my-0" />
          </section>
        )}

        {/* 기술 스택 */}
        {project.techStack.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="text-xs px-3 py-1 border border-[#1a5c38] text-[#1a5c38] font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* 이전 / 다음 네비게이션 */}
        <nav className="no-print border-t border-gray-200 pt-6 flex justify-between gap-4 mt-8">
          {prev ? (
            <Link href={`/resume/project/${prev.id}`} className="group flex flex-col gap-1 max-w-[45%]">
              <span className="text-xs text-gray-400">← 이전</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a5c38] transition-colors">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/resume/project/${next.id}`} className="group flex flex-col items-end gap-1 max-w-[45%]">
              <span className="text-xs text-gray-400">다음 →</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a5c38] transition-colors">{next.title}</span>
            </Link>
          ) : <span />}
        </nav>

      </div>
    </main>
  )
}
