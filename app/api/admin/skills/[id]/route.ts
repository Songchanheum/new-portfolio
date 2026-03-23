export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { SkillData } from '@/types'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SKILLS_SELECT = 'id, name, category, proficiency, context, display_order'

type SkillRow = { id: string; name: string; category: string; proficiency: string; context: string; display_order: number }
function rowToSkillData(row: SkillRow): SkillData {
  return { id: row.id, name: row.name, category: row.category ?? '', proficiency: row.proficiency ?? '', context: row.context ?? '', displayOrder: row.display_order }
}

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { name, category, proficiency, context: ctx, displayOrder } = await req.json() as {
      name?: string; category?: string; proficiency?: string; context?: string; displayOrder?: number
    }

    const payload: Record<string, unknown> = {}
    if (name !== undefined) payload.name = name.trim()
    if (category !== undefined) payload.category = category.trim()
    if (proficiency !== undefined) payload.proficiency = proficiency.trim()
    if (ctx !== undefined) payload.context = ctx.trim()
    if (displayOrder !== undefined) payload.display_order = displayOrder

    if (Object.keys(payload).length === 0) return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 })

    const { data, error } = await supabaseAdmin.from('skills').update(payload).eq('id', id).select(SKILLS_SELECT).single()
    if (error) return NextResponse.json({ error: 'Skill 수정 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: rowToSkillData(data as SkillRow) })
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

    const { error } = await supabaseAdmin.from('skills').delete().eq('id', id)
    if (error) return NextResponse.json({ error: 'Skill 삭제 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: { id } })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}