import type { SkillData } from '@/types'
import SkillDots from '@/components/resume/SkillDots'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'
import { SKILL_CATEGORY_LABEL, SKILL_CATEGORY_ORDER } from '@/components/resume/resume-copy'

type Props = {
  skills: SkillData[]
  /** 섹션 제목 (표지: Skills, 인쇄본: 동일) */
  title?: string
  sectionClassName?: string
  /** 인쇄용 섹션 제목에 print-section-title 적용 */
  printSectionTitle?: boolean
}

export default function ResumeSkillsGrid({
  skills,
  title = 'Skills',
  sectionClassName = '',
  printSectionTitle = false,
}: Props) {
  if (skills.length === 0) return null

  const grouped = skills.reduce<Record<string, SkillData[]>>((acc, s) => {
    const cat = s.category || 'etc'
    acc[cat] = [...(acc[cat] ?? []), s]
    return acc
  }, {})

  const sortedCategories = SKILL_CATEGORY_ORDER.filter((c) => grouped[c]?.length)

  return (
    <section className={`py-6 border-b border-gray-300 ${sectionClassName}`.trim()}>
      <ResumeSectionTitle printAvoidBreakAfter={printSectionTitle}>{title}</ResumeSectionTitle>
      <div className="grid grid-cols-2 gap-x-12 gap-y-5">
        {sortedCategories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              {SKILL_CATEGORY_LABEL[cat] ?? cat}
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
  )
}
