import type { ActivityData } from '@/types'
import ResumeSectionTitle from '@/components/resume/ResumeSectionTitle'
import { ResumeRichText } from '@/components/resume/ResumeRichText'
import { formatResumeYearMonth } from '@/components/resume/resume-format'

type Props = {
  activities: ActivityData[]
  sectionClassName?: string
  title?: string
  printSectionTitle?: boolean
  emptyMessage?: string
}

export default function ResumeActivitiesSection({
  activities,
  sectionClassName = '',
  title = '대내외활동 · Activities',
  printSectionTitle = false,
  emptyMessage = '등록된 활동이 없습니다.',
}: Props) {
  return (
    <section className={`py-8 ${sectionClassName}`.trim()}>
      <ResumeSectionTitle printAvoidBreakAfter={printSectionTitle}>{title}</ResumeSectionTitle>
      {activities.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="space-y-0">
          {activities.map((activity, idx) => (
            <div
              key={activity.id}
              className={`py-4 ${idx < activities.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="flex gap-6 items-start">
                <div className="w-24 shrink-0">
                  <p className="text-xs text-gray-400">{formatResumeYearMonth(activity.date)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base font-bold text-gray-900 resume-serif"
                    style={{ fontFamily: 'var(--font-serif)' }}
                  >
                    {activity.title}
                  </h3>
                  <ResumeRichText
                    html={activity.description}
                    className="text-sm text-gray-600 mt-1.5 leading-relaxed"
                  />
                  {activity.blogUrl && (
                    <p className="text-xs text-gray-400 mt-1 break-all">{activity.blogUrl}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
