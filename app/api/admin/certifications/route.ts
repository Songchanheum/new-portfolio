export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { CertificationData } from '@/types'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CERT_SELECT = 'id, name, issued_by, issued_at, description, display_order'

type CertRow = { id: string; name: string; issued_by: string; issued_at: string | null; description: string; display_order: number }
function rowToCertData(row: CertRow): CertificationData {
  return { id: row.id, name: row.name, issuedBy: row.issued_by ?? '', issuedAt: row.issued_at ?? null, description: row.description ?? '', displayOrder: row.display_order }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { data, error } = await supabaseAdmin.from('certifications').select(CERT_SELECT).order('display_order', { ascending: true })
    if (error) return NextResponse.json({ error: 'Certifications 조회 실패' }, { status: 500 })

    return NextResponse.json({ data: (data as CertRow[]).map(rowToCertData) })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { name, issuedBy, issuedAt, description, displayOrder } = await req.json() as {
      name: string; issuedBy?: string; issuedAt?: string | null; description?: string; displayOrder?: number
    }

    if (!name?.trim()) return NextResponse.json({ error: 'name은 필수입니다' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('certifications')
      .insert({ name: name.trim(), issued_by: (issuedBy ?? '').trim(), issued_at: issuedAt ?? null, description: (description ?? '').trim(), display_order: displayOrder ?? 0 })
      .select(CERT_SELECT)
      .single()

    if (error) return NextResponse.json({ error: 'Certification 생성 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: rowToCertData(data as CertRow) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}