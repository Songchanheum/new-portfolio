import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { CertificationData } from '@/types'

export const dynamic = 'force-dynamic'

async function fetchCertifications(): Promise<CertificationData[]> {
  try {
    const supabase = await createSupabaseServerClient()
    const { data, error } = await supabase
      .from('certifications')
      .select('id, name, issued_by, issued_at, description, display_order')
      .order('display_order')
    if (error || !data) return []
    return data.map((r) => ({
      id: r.id,
      name: r.name,
      issuedBy: r.issued_by ?? '',
      issuedAt: r.issued_at ?? null,
      description: r.description ?? '',
      displayOrder: r.display_order,
    }))
  } catch {
    return []
  }
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}`
}

export default async function CertificationsPage() {
  const certs = await fetchCertifications()

  return (
    <main className="min-h-screen bg-white resume-sans" style={{ fontFamily: 'var(--font-sans-resume)' }}>
      <div className="max-w-[794px] mx-auto px-8 py-10">

        <header className="border-t-4 border-[#1a5c38] pt-6 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#1a5c38] uppercase mb-1 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                송찬흠 · Resume
              </p>
              <h1 className="text-3xl font-black tracking-tight resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                자격증
              </h1>
            </div>
            <Link href="/resume" className="no-print text-xs text-gray-400 hover:text-[#1a5c38] transition-colors">
              ← 표지로
            </Link>
          </div>
        </header>

        <hr className="border-gray-300 mb-8" />

        {certs.length === 0 ? (
          <p className="text-sm text-gray-400 py-12 text-center">등록된 자격증이 없습니다.</p>
        ) : (
          <section className="space-y-0">
            {certs.map((cert, idx) => (
              <div key={cert.id}>
                <div className="py-5 flex gap-6 items-start">
                  <div className="w-28 shrink-0">
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(cert.issuedAt)}</p>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-bold text-gray-900 resume-serif" style={{ fontFamily: 'var(--font-serif)' }}>
                      {cert.name}
                    </h2>
                    {cert.issuedBy && (
                      <p className="text-xs font-medium text-[#1a5c38] mt-0.5">{cert.issuedBy}</p>
                    )}
                    {cert.description && (
                      <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{cert.description}</p>
                    )}
                  </div>
                </div>
                {idx < certs.length - 1 && <hr className="border-gray-100" />}
              </div>
            ))}
          </section>
        )}

      </div>
    </main>
  )
}
