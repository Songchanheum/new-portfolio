import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { SkillData } from '@/types'
import PDFDownloadButton from '@/components/resume/PDFDownloadButton'
import ResumeMasthead from '@/components/resume/ResumeMasthead'
import ResumeSkillsGrid from '@/components/resume/ResumeSkillsGrid'
import ResumeIndexSection from '@/components/resume/ResumeIndexSection'

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

export default async function ResumePage() {
  const skills = await fetchSkills()

  return (
    <main
      className="min-h-screen bg-white resume-sans"
      style={{ fontFamily: 'var(--font-sans-resume)' }}
    >
      <div className="max-w-[794px] mx-auto px-8 py-10">
        <ResumeMasthead actions={<PDFDownloadButton />} personalVisibility="print-only" />

        <hr className="border-gray-300 my-0" />

        <ResumeSkillsGrid skills={skills} printSectionTitle />

        <ResumeIndexSection mode="hub" printSectionTitle />
      </div>
    </main>
  )
}
