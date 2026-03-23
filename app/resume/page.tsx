import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { SkillData } from '@/types'
import PDFDownloadButton from '@/components/resume/PDFDownloadButton'

export const dynamic = 'force-dynamic'

async function fetchSkills(): Promise<SkillData[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('skills')
      .select('id, name, category, proficiency, context, display_order')
      .order('display_order')
    if (error || !data) return []
    return data.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      proficiency: r.proficiency,
      context: r.context,
      displayOrder: r.display_order,
    }))
  } catch {
    return []
  }
}

const PROFICIENCY_DOTS: Record<string, number> = {
  expert: 5,
  advanced: 4,
  intermediate: 3,
}

function SkillDots({ proficiency }: { proficiency: string }) {
  const filled = PROFICIENCY_DOTS[proficiency] ?? 3
  return (
    <span className="inline-flex gap-0.5 ml-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full border ${i < filled ? 'bg-[#1a5c38] border-[#1a5c38]' : 'border-gray-400'}`}
        />
      ))}
    </span>
  )
}

const CATEGORY_LABEL: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  etc: 'Etc',
}

const NAV_SECTIONS = [
  { href: '/resume/career', label: '경력', sub: 'Career' },
  { href: '/resume/projects', label: '프로젝트', sub: 'Projects' },
  { href: '/resume/certifications', label: '자격증', sub: 'Certifications' },
  { href: '/resume/activities', label: '대내외활동', sub: 'Activities' },
]

export default async function ResumePage() {
  const skills = await fetchSkills()

  const grouped = skills.reduce<Record<string, SkillData[]>>((acc, s) => {
    const cat = s.category || 'etc'
    acc[cat] = [...(acc[cat] ?? []), s]
    return acc
  }, {})

  const categoryOrder = ['frontend', 'backend', 'devops', 'etc']
  const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length)

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      {/* 컨테이너 */}
      <div className="max-w-[794px] mx-auto px-8 py-10">

        {/* ── 마스트헤드 ── */}
        <header className="border-t-4 border-[#1a5c38] pt-6 pb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-5xl font-black tracking-tight leading-none mb-2 resume-serif"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                송찬흠
              </h1>
              <p className="text-lg font-medium text-[#1a5c38] tracking-wide mb-1">
                웹 프론트엔드 개발자 · 수석
              </p>
              <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                AI를 협업자로 활용하며 전 영역을 넘나드는 9년차 개발자.
                경험을 먼저 설계하고 기술로 구현합니다.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <PDFDownloadButton />
            </div>
          </div>

          {/* 개인정보 — print only */}
          <div className="print-only mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 grid grid-cols-2 gap-x-8 gap-y-1">
            <span>생년월일: 1992. 12. 12</span>
            <span>거주지: 인천 동구</span>
            <span>이메일: — </span>
            <span>연락처: — </span>
          </div>
        </header>

        <hr className="border-gray-300 my-0" />

        {/* ── 기술 스택 ── */}
        {skills.length > 0 && (
          <section className="py-6 border-b border-gray-300">
            <h2
              className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-4 resume-serif"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Skills
            </h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
              {sortedCategories.map((cat) => (
                <div key={cat}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    {CATEGORY_LABEL[cat] ?? cat}
                  </p>
                  <ul className="space-y-1.5">
                    {grouped[cat].map((skill) => (
                      <li key={skill.id} className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <SkillDots proficiency={skill.proficiency} />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 섹션 네비게이션 ── */}
        <section className="py-6">
          <h2
            className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-4 resume-serif"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Index
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {NAV_SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="no-print group flex items-center justify-between border border-gray-200 px-5 py-4 hover:border-[#1a5c38] hover:bg-[#e8f5ed] transition-colors"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900 group-hover:text-[#1a5c38]">
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-400 tracking-wider">{s.sub}</p>
                </div>
                <span className="text-[#1a5c38] text-lg">→</span>
              </Link>
            ))}
          </div>

          {/* print용 섹션 목록 */}
          <div className="print-only mt-2 text-xs text-gray-500 grid grid-cols-4 gap-4">
            {NAV_SECTIONS.map((s) => (
              <span key={s.href}>{s.label} — {s.href}</span>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}
