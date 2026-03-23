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

type SkillRow = {
  id: string
  name: string
  category: string
  proficiency: string
  context: string
  display_order: number
}

function rowToSkillData(row: SkillRow): SkillData {
  return {
    id: row.id,
    name: row.name,
    category: row.category ?? '',
    proficiency: row.proficiency ?? '',
    context: row.context ?? '',
    displayOrder: row.display_order,
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('skills')
      .select(SKILLS_SELECT)
      .order('display_order', { ascending: true })

    if (error) return NextResponse.json({ error: 'Skills 조회 실패' }, { status: 500 })

    return NextResponse.json({ data: (data as SkillRow[]).map(rowToSkillData) })
  } catch (err) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { name, category, proficiency, context, displayOrder } = await req.json() as {
      name: string
      category?: string
      proficiency?: string
      context?: string
      displayOrder?: number
    }

    if (!name?.trim()) return NextResponse.json({ error: 'name은 필수입니다' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('skills')
      .insert({
        name: name.trim(),
        category: (category ?? '').trim(),
        proficiency: (proficiency ?? '').trim(),
        context: (context ?? '').trim(),
        display_order: displayOrder ?? 0,
      })
      .select(SKILLS_SELECT)
      .single()

    if (error) return NextResponse.json({ error: 'Skill 생성 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: rowToSkillData(data as SkillRow) }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}