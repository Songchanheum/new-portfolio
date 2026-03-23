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

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { name, issuedBy, issuedAt, description, displayOrder } = await req.json() as {
      name?: string; issuedBy?: string; issuedAt?: string | null; description?: string; displayOrder?: number
    }

    const payload: Record<string, unknown> = {}
    if (name !== undefined) payload.name = name.trim()
    if (issuedBy !== undefined) payload.issued_by = issuedBy.trim()
    if (issuedAt !== undefined) payload.issued_at = issuedAt
    if (description !== undefined) payload.description = description.trim()
    if (displayOrder !== undefined) payload.display_order = displayOrder

    if (Object.keys(payload).length === 0) return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 })

    const { data, error } = await supabaseAdmin.from('certifications').update(payload).eq('id', id).select(CERT_SELECT).single()
    if (error) return NextResponse.json({ error: 'Certification 수정 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: rowToCertData(data as CertRow) })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { error } = await supabaseAdmin.from('certifications').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Certification 삭제 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: { id } })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}