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

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { title, date, description, blogUrl, displayOrder } = (await req.json()) as {
      title?: string
      date?: string | null
      description?: string
      blogUrl?: string
      displayOrder?: number
    }

    const payload: Record<string, unknown> = {}
    if (title !== undefined) {
      if (!title.trim()) return NextResponse.json({ error: 'title은 빈 값일 수 없습니다' }, { status: 400 })
      payload.title = title.trim()
    }
    if (date !== undefined) payload.date = date && String(date).trim() ? date : null
    if (description !== undefined) payload.description = description.trim()
    if (blogUrl !== undefined) payload.blog_url = blogUrl.trim()
    if (displayOrder !== undefined) payload.display_order = displayOrder

    if (Object.keys(payload).length === 0)
      return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 })

    const { data, error } = await supabaseAdmin
      .from('activities')
      .update(payload)
      .eq('id', id)
      .select(ACTIVITY_SELECT)
      .single()

    if (error)
      return NextResponse.json({ error: 'Activity 수정 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: rowToActivityData(data as ActivityRow) })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })

    const { error } = await supabaseAdmin.from('activities').delete().eq('id', id)
    if (error)
      return NextResponse.json({ error: 'Activity 삭제 실패: ' + error.message }, { status: 500 })

    return NextResponse.json({ data: { id } })
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
