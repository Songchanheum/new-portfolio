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
import ResumeMasthead from '@/components/resume/ResumeMasthead'
import ResumeSkillsGrid from '@/components/resume/ResumeSkillsGrid'
import ResumeIndexSection from '@/components/resume/ResumeIndexSection'
import ResumeCareerArticles from '@/components/resume/ResumeCareerArticles'
import ResumeProjectArticles from '@/components/resume/ResumeProjectArticles'
import ResumeCertificationsSection from '@/components/resume/ResumeCertificationsSection'
import ResumeActivitiesSection from '@/components/resume/ResumeActivitiesSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '송찬흠 이력서 (인쇄)',
  robots: { index: false, follow: false },
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
    supabase
      .from('certifications')
      .select('id, name, issued_by, issued_at, description, display_order')
      .order('display_order'),
    supabase
      .from('activities')
      .select('id, title, date, description, blog_url, display_order')
      .order('display_order'),
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

  const skillsPageClass = skills.length > 0 ? 'print-page-start' : ''
  const indexPageClass = skills.length === 0 ? 'print-page-start' : ''

  return (
    <main
      className="min-h-screen bg-white resume-sans"
      style={{ fontFamily: 'var(--font-sans-resume)' }}
    >
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

        <ResumeMasthead personalVisibility="always" headerClassName="print-avoid-break" />

        <hr className="border-gray-300 my-0" />

        <ResumeSkillsGrid
          skills={skills}
          sectionClassName={skillsPageClass}
          printSectionTitle
        />

        <ResumeIndexSection
          mode="static"
          sectionClassName={`border-b border-gray-300 ${indexPageClass}`.trim()}
          printSectionTitle
        />

        <ResumeCareerArticles careers={careers} sectionClassName="print-page-start" printSectionTitle />
        <ResumeProjectArticles projects={projects} sectionClassName="print-page-start" printSectionTitle />
        <ResumeCertificationsSection
          certifications={certs}
          sectionClassName="print-page-start"
          printSectionTitle
        />
        <ResumeActivitiesSection
          activities={activities}
          sectionClassName="print-page-start"
          printSectionTitle
        />
      </div>
    </main>
  )
}
