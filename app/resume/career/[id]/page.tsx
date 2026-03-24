import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import { sanitizeHtml } from '@/lib/wysiwyg'
import { WysiwygRenderer } from '@/components/wysiwyg/WysiwygRenderer'
import type { CareerDetailData } from '@/types'

export const dynamic = 'force-dynamic'

async function fetchCareer(id: string): Promise<CareerDetailData | null> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('career')
      .select('id, company, company_url, role, period, description, detail_description, achievements, career_tech_stack, display_order')
      .eq('id', id)
      .single()
    if (error || !data) return null
    return {
      id: data.id,
      company: data.company,
      companyUrl: data.company_url ?? '',
      role: data.role,
      period: data.period,
      description: data.description,
      displayOrder: data.display_order,
      detailDescription: data.detail_description ?? '',
      achievements: data.achievements ?? [],
      careerTechStack: data.career_tech_stack ?? [],
    }
  } catch {
    return null
  }
}

async function fetchAdjacentCareers(displayOrder: number) {
  try {
    const supabase = await createSupabaseServerClient()
    const [prevRes, nextRes] = await Promise.all([
      supabase
        .from('career')
        .select('id, company, display_order')
        .lt('display_order', displayOrder)
        .order('display_order', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('career')
        .select('id, company, display_order')
        .gt('display_order', displayOrder)
        .order('display_order')
        .limit(1)
        .single(),
    ])
    return {
      prev: prevRes.data ?? null,
      next: nextRes.data ?? null,
    }
  } catch {
    return { prev: null, next: null }
  }
}

export default async function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const career = await fetchCareer(id)
  if (!career) notFound()

  const { prev, next } = await fetchAdjacentCareers(career.displayOrder)

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      <div className="max-w-[794px] mx-auto px-8 py-10">

        {/* 헤더 */}
        <header className="border-t-4 border-[#1a5c38] pt-6 pb-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              송찬흠 · Career
            </p>
            <Link href="/resume/career" className="no-print text-xs text-gray-400 hover:text-[#1a5c38] transition-colors">
              ← 경력 목록
            </Link>
          </div>
          <h1 className="text-3xl font-black tracking-tight resume-serif mb-1" style={{ fontFamily: 'var(--font-serif)' }}>
            {career.company}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-base font-medium text-[#1a5c38]">{career.role}</span>
            <span className="text-gray-300">|</span>
            <span className="text-sm text-gray-500">{career.period}</span>
          </div>
        </header>

        <hr className="border-gray-300 mb-8" />

        {/* 회사 개요 */}
        <section className="mb-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
            Overview
          </h2>
          <p className="text-sm text-gray-700 leading-7">{career.description}</p>
        </section>

        {/* 상세 업무 */}
        {career.detailDescription && (
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              담당 업무
            </h2>
            <WysiwygRenderer
              html={sanitizeHtml(career.detailDescription)}
              className="prose prose-sm max-w-none text-gray-700 [&_li_p]:my-0"
            />
          </section>
        )}

        {/* 성과 */}
        {career.achievements.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              주요 성과
            </h2>
            <ul className="space-y-2 list-none pl-0">
              {career.achievements.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-700">
                  <span className="text-[#1a5c38] font-bold shrink-0">·</span>
                  <WysiwygRenderer
                    html={sanitizeHtml(item)}
                    className="prose prose-sm max-w-none flex-1 text-gray-700 [&_p]:my-1 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 기술 스택 */}
        {career.careerTechStack.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-3 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {career.careerTechStack.map((tech) => (
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
            <Link href={`/resume/career/${prev.id}`} className="group flex flex-col gap-1 max-w-[45%]">
              <span className="text-xs text-gray-400">← 이전</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a5c38] transition-colors">{prev.company}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link href={`/resume/career/${next.id}`} className="group flex flex-col items-end gap-1 max-w-[45%]">
              <span className="text-xs text-gray-400">다음 →</span>
              <span className="text-sm font-medium text-gray-700 group-hover:text-[#1a5c38] transition-colors">{next.company}</span>
            </Link>
          ) : <span />}
        </nav>

      </div>
    </main>
  )
}
