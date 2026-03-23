export function formatResumeYearMonth(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}`
}
