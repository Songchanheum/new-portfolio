export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { CareerData } from '@/types'

// Service Role 클라이언트 — RLS 우회, 서버 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type CareerRow = {
  id: string
  company: string
  role: string
  period: string
  description: string
  display_order: number
  updated_at: string | null
}

function rowToCareerData(row: CareerRow): CareerData {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    period: row.period,
    description: row.description,
    displayOrder: row.display_order,
  }
}

type RouteContext = { params: Promise<{ id: string }> }

// PATCH: 경력 항목 수정
export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    const body = await req.json()
    const { company, role, period, description, displayOrder } = body as {
      company?: string
      role?: string
      period?: string
      description?: string
      displayOrder?: number
    }

    // 수정할 필드만 업데이트 (부분 업데이트 지원)
    const updatePayload: Record<string, unknown> = {}
    if (company !== undefined) updatePayload.company = company.trim()
    if (role !== undefined) updatePayload.role = role.trim()
    if (period !== undefined) updatePayload.period = period.trim()
    if (description !== undefined) updatePayload.description = description.trim()
    if (displayOrder !== undefined) updatePayload.display_order = displayOrder

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('career')
      .update(updatePayload)
      .eq('id', id)
      .select('id, company, role, period, description, display_order, updated_at')
      .single()

    if (error) {
      console.error('[api/admin/career PATCH] 수정 실패:', error.message)
      return NextResponse.json({ error: '경력 항목 수정 실패: ' + error.message }, { status: 500 })
    }

    const item: CareerData = rowToCareerData(data as CareerRow)
    return NextResponse.json({ data: item })
  } catch (err) {
    console.error('[api/admin/career PATCH] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// DELETE: 경력 항목 삭제
export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params

    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    const { error } = await supabaseAdmin.from('career').delete().eq('id', id)

    if (error) {
      console.error('[api/admin/career DELETE] 삭제 실패:', error.message)
      return NextResponse.json({ error: '경력 항목 삭제 실패: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('[api/admin/career DELETE] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
