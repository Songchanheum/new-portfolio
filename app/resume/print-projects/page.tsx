import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { ProjectDetailData } from '@/types'
import PrintAutoTrigger from '@/components/resume/PrintAutoTrigger'
import { ResumeRichText } from '@/components/resume/ResumeRichText'
import { sanitizeHtml } from '@/lib/wysiwyg'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '송찬흠 프로젝트 포트폴리오 (인쇄)',
  robots: { index: false, follow: false },
}

export default async function PrintProjectsPage() {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('projects')
    .select('id, title, description, tech_stack, project_url, detail_description, role, period, contributions, display_order')
    .order('display_order')

  const projects: ProjectDetailData[] =
    data?.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      techStack: r.tech_stack ?? [],
      thumbnailUrl: '',
      projectUrl: r.project_url ?? '',
      displayOrder: r.display_order,
      detailDescription: r.detail_description ?? '',
      role: r.role ?? '',
      period: r.period ?? '',
      contributions: r.contributions ?? '',
    })) ?? []

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      <Suspense fallback={null}>
        <PrintAutoTrigger titleOverride="송찬흠_프로젝트포트폴리오" />
      </Suspense>

      <div className="max-w-[794px] mx-auto px-8 py-10">
        <p className="no-print text-xs text-gray-400 mb-4">
          <Link href="/resume/projects" className="hover:text-[#1a5c38]">
            ← 프로젝트 목록으로
          </Link>
          <span className="mx-2">·</span>
          인쇄 또는 &quot;PDF로 저장&quot;을 선택하세요.
        </p>

        {/* 표지 헤더 */}
        <header className="border-t-4 border-[#1a5c38] pt-6 pb-8 mb-2">
          <p className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-1 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
            송찬흠 · Portfolio
          </p>
          <h1 className="text-4xl font-black tracking-tight resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
            프로젝트 포트폴리오
          </h1>
        </header>

        <hr className="border-gray-300 mb-10" />

        {/* 프로젝트 목록 */}
        <div className="space-y-12">
          {projects.map((project, idx) => (
            <article
              key={project.id}
              className={idx !== 0 ? 'border-t border-gray-200 pt-10' : ''}
              style={{ breakInside: 'avoid-page' }}
            >
              {/* 제목 + 기간 */}
              <header className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <h2
                    className="text-2xl font-black resume-serif text-gray-900"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {project.title}
                  </h2>
                  {project.period && (
                    <span className="text-sm text-gray-400 shrink-0 mt-1">{project.period}</span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                  {project.role && <span className="font-medium text-[#1a5c38]">{project.role}</span>}
                  {project.role && project.projectUrl && <span className="text-gray-300">|</span>}
                  {project.projectUrl && (
                    <a href={project.projectUrl} className="text-xs text-gray-400 break-all hover:text-[#1a5c38]">
                      {project.projectUrl}
                    </a>
                  )}
                </div>
              </header>

              {/* 한줄 설명 */}
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{project.description}</p>

              {/* 상세 내용 */}
              {project.detailDescription && (
                <ResumeRichText html={sanitizeHtml(project.detailDescription)} className="text-sm leading-7 [&_li]:my-0 [&_li_p]:my-0" />
              )}

              {/* 기여 */}
              {project.contributions && (
                <ResumeRichText html={sanitizeHtml(project.contributions)} className="text-sm leading-7 mt-4 [&_li]:my-0 [&_li_p]:my-0" />
              )}

              {/* 기술스택 */}
              {project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-5">
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
      </div>
    </main>
  )
}
