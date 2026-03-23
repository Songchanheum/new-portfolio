import { Suspense } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type {
  ActivityData,
  CareerDetailData,
  CertificationData,
  ProjectDetailData,
  SkillData,
} from '@/types'
import PrintAutoTrigger from '@/components/resume/PrintAutoTrigger'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '송찬흠 이력서 (인쇄)',
  robots: { index: false, follow: false },
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
  { id: 'career', label: '경력', sub: 'Career' },
  { id: 'projects', label: '프로젝트', sub: 'Projects' },
  { id: 'certifications', label: '자격증', sub: 'Certifications' },
  { id: 'activities', label: '대내외활동', sub: 'Activities' },
]

function formatYm(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default async function ResumePrintPage() {
  const supabase = await createSupabaseServerClient()

  const [skillsRes, careerRes, projectsRes, certsRes, activitiesRes] = await Promise.all([
    supabase
      .from('skills')
      .select('id, name, category, proficiency, context, display_order')
      .order('display_order'),
    supabase
      .from('career')
      .select(
        'id, company, company_url, role, period, description, detail_description, achievements, career_tech_stack, display_order'
      )
      .order('display_order'),
    supabase
      .from('projects')
      .select(
        'id, title, description, tech_stack, thumbnail_url, project_url, detail_description, role, period, contributions, display_order'
      )
      .order('display_order'),
    supabase.from('certifications').select('id, name, issued_by, issued_at, description, display_order').order('display_order'),
    supabase.from('activities').select('id, title, date, description, blog_url, display_order').order('display_order'),
  ])

  const skills: SkillData[] =
    skillsRes.data?.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      proficiency: r.proficiency,
      context: r.context,
      displayOrder: r.display_order,
    })) ?? []

  const careers: CareerDetailData[] =
    careerRes.data?.map((r) => ({
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
    })) ?? []

  const projects: ProjectDetailData[] =
    projectsRes.data?.map((r) => ({
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
    })) ?? []

  const certs: CertificationData[] =
    certsRes.data?.map((r) => ({
      id: r.id,
      name: r.name,
      issuedBy: r.issued_by ?? '',
      issuedAt: r.issued_at ?? null,
      description: r.description ?? '',
      displayOrder: r.display_order,
    })) ?? []

  const activities: ActivityData[] =
    activitiesRes.data?.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date ?? null,
      description: r.description ?? '',
      blogUrl: r.blog_url ?? '',
      displayOrder: r.display_order,
    })) ?? []

  const grouped = skills.reduce<Record<string, SkillData[]>>((acc, s) => {
    const cat = s.category || 'etc'
    acc[cat] = [...(acc[cat] ?? []), s]
    return acc
  }, {})
  const categoryOrder = ['frontend', 'backend', 'devops', 'etc']
  const sortedCategories = categoryOrder.filter((c) => grouped[c]?.length)

  const sectionTitle = (text: string) => (
    <h2
      className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-4 resume-serif print-section-title"
      style={{ fontFamily: 'var(--font-serif)' }}
    >
      {text}
    </h2>
  )

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      <Suspense fallback={null}>
        <PrintAutoTrigger />
      </Suspense>

      <div className="max-w-[794px] mx-auto px-8 py-10">
        <p className="no-print text-xs text-gray-400 mb-4">
          <Link href="/resume" className="hover:text-[#1a5c38]">
            ← 표지로
          </Link>
          <span className="mx-2">·</span>
          인쇄 또는 &quot;PDF로 저장&quot;을 선택하세요.
        </p>

        {/* 표지 */}
        <header className="border-t-4 border-[#1a5c38] pt-6 pb-5 print-avoid-break">
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
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-600 grid grid-cols-2 gap-x-8 gap-y-1">
            <span>생년월일: 1992. 12. 12</span>
            <span>거주지: 인천 동구</span>
            <span>이메일: — </span>
            <span>연락처: — </span>
          </div>
        </header>

        <hr className="border-gray-300 my-0" />

        {skills.length > 0 && (
          <section className="py-6 border-b border-gray-300 print-page-start">
            {sectionTitle('Skills')}
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
                        <SkillDots proficiency={skill.proficiency} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Index — 스킬이 없을 때만 표지 다음 페이지부터 시작 */}
        <section
          className={`py-6 border-b border-gray-300${skills.length === 0 ? ' print-page-start' : ''}`}
        >
          {sectionTitle('Index')}
          <div className="grid grid-cols-2 gap-4">
            {NAV_SECTIONS.map((s) => (
              <div
                key={s.id}
                className="print-avoid-break flex items-center justify-between border border-gray-200 px-5 py-4 bg-white"
              >
                <div>
                  <p className="text-base font-semibold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-400 tracking-wider">{s.sub}</p>
                </div>
                <span className="text-[#1a5c38] text-lg">→</span>
              </div>
            ))}
          </div>
        </section>

        {/* 경력 */}
        <section className="py-8 border-b border-gray-300 print-page-start">
          {sectionTitle('경력 · Career')}
          <div className="space-y-8">
            {careers.map((career) => (
              <article key={career.id}>
                <header className="mb-3">
                  <h3 className="text-xl font-black resume-serif text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
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

        {/* 프로젝트 */}
        <section className="py-8 border-b border-gray-300 print-page-start">
          {sectionTitle('프로젝트 · Projects')}
          <div className="space-y-8">
            {projects.map((project) => (
              <article key={project.id}>
                <header className="mb-3">
                  <h3 className="text-xl font-black resume-serif text-gray-900" style={{ fontFamily: 'var(--font-serif)' }}>
                    {project.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mt-1">
                    {project.role && <span className="font-medium text-[#1a5c38]">{project.role}</span>}
                    {project.role && project.period && <span className="text-gray-300">|</span>}
                    {project.period && <span>{project.period}</span>}
                  </div>
                  {project.projectUrl && <p className="text-xs text-gray-400 mt-1 break-all">{project.projectUrl}</p>}
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

        {/* 자격증 */}
        <section className="py-8 border-b border-gray-300 print-page-start">
          {sectionTitle('자격증 · Certifications')}
          {certs.length === 0 ? (
            <p className="text-sm text-gray-400">등록된 자격증이 없습니다.</p>
          ) : (
            <div className="space-y-0">
              {certs.map((cert, idx) => (
                <div key={cert.id} className={`py-4 ${idx < certs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex gap-6 items-start">
                    <div className="w-24 shrink-0">
                      <p className="text-xs text-gray-400">{formatYm(cert.issuedAt)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                        {cert.name}
                      </h3>
                      {cert.issuedBy && <p className="text-xs font-medium text-[#1a5c38] mt-0.5">{cert.issuedBy}</p>}
                      {cert.description && <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{cert.description}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 활동 */}
        <section className="py-8 print-page-start">
          {sectionTitle('대내외활동 · Activities')}
          {activities.length === 0 ? (
            <p className="text-sm text-gray-400">등록된 활동이 없습니다.</p>
          ) : (
            <div className="space-y-0">
              {activities.map((activity, idx) => (
                <div
                  key={activity.id}
                  className={`py-4 ${idx < activities.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  <div className="flex gap-6 items-start">
                    <div className="w-24 shrink-0">
                      <p className="text-xs text-gray-400">{formatYm(activity.date)}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-gray-900 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                        {activity.title}
                      </h3>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{activity.description}</p>
                      )}
                      {activity.blogUrl && <p className="text-xs text-gray-400 mt-1 break-all">{activity.blogUrl}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
