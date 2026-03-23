import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { CareerDetailData } from '@/types'

export const dynamic = 'force-dynamic'

async function fetchCareers(): Promise<CareerDetailData[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('career')
      .select('id, company, company_url, role, period, description, detail_description, achievements, career_tech_stack, display_order')
      .order('display_order')
    if (error || !data) return []
    return data.map((r) => ({
      id: r.id,
      company: r.company,
      companyUrl: r.company_url ?? '',
      role: r.role,
      period: r.period,
      description: r.description,
      displayOrder: r.display_order,
      detailDescription: r.detail_description ?? '',
      achievements: r.achievements ?? [],
      careerTechStack: r.career_tech_stack ?? [],
    }))
  } catch {
    return []
  }
}

export default async function CareerHubPage() {
  const careers = await fetchCareers()

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
                경력
              </h1>
            </div>
            <Link href="/resume" className="no-print text-xs text-gray-400 hover:text-[#1a5c38] transition-colors">
              ← 표지로
            </Link>
          </div>
        </header>

        <hr className="border-gray-300 mb-8" />

        {/* 타임라인 */}
        <section className="space-y-0">
          {careers.map((career, idx) => (
            <div key={career.id}>
              <Link
                href={`/resume/career/${career.id}`}
                className="no-print group flex gap-6 py-6 hover:bg-gray-50 -mx-4 px-4 transition-colors"
              >
                <div className="flex flex-col items-center pt-1">
                  <div className="w-3 h-3 rounded-full bg-[#1a5c38] shrink-0" />
                  {idx < careers.length - 1 && (
                    <div className="w-px flex-1 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#1a5c38] transition-colors resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                        {career.company}
                      </h2>
                      <p className="text-sm font-medium text-[#1a5c38] mt-0.5">{career.role}</p>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 mt-1">{career.period}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed line-clamp-2">
                    {career.description}
                  </p>
                  {career.careerTechStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {career.careerTechStack.map((tech) => (
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
                  <div>
                    <h2 className="text-base font-bold resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>{career.company}</h2>
                    <p className="text-sm text-[#1a5c38]">{career.role}</p>
                  </div>
                  <span className="text-xs text-gray-500">{career.period}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{career.description}</p>
              </div>

              {idx < careers.length - 1 && <hr className="border-gray-100 no-print" />}
            </div>
          ))}
        </section>

      </div>
    </main>
  )
}
