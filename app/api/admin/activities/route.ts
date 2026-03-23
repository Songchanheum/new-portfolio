export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { ActivityData } from '@/types'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ACTIVITY_SELECT = 'id, title, date, description, blog_url, display_order'

type ActivityRow = {
  id: string
  title: string
  date: string | null
  description: string
  blog_url: string
  display_order: number
}

function rowToActivityData(row: ActivityRow): ActivityData {
  return {
    id: row.id,
    title: row.title,
    date: row.date ?? null,
    description: row.description ?? '',
    blogUrl: row.blog_url ?? '',
    displayOrder: row.display_order,
  }
}

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { data, error } = await supabaseAdmin
      .from('activities')
      .select(ACTIVITY_SELECT)
      .order('display_order', { ascending: true })

    if (error) return NextResponse.json({ error: 'Activities 조회 실패' }, { status: 500 })

    return NextResponse.json({ data: (data as ActivityRow[]).map(rowToActivityData) })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { title, date, description, blogUrl, displayOrder } = (await req.json()) as {
      title: string
      date?: string | null
      description?: string
      blogUrl?: string
      displayOrder?: number
    }

    if (!title?.trim()) return NextResponse.json({ error: 'title은 필수입니다' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('activities')
      .insert({
        title: title.trim(),
        date: date && String(date).trim() ? date : null,
        description: (description ?? '').trim(),
        blog_url: (blogUrl ?? '').trim(),
        display_order: displayOrder ?? 0,
      })
      .select(ACTIVITY_SELECT)
      .single()

    if (error)
      return NextResponse.json({ error: 'Activity 생성 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: rowToActivityData(data as ActivityRow) }, { status: 201 })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
