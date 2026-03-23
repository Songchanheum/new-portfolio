export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { ProjectData } from '@/types'

// Service Role 클라이언트 — RLS 우회, 서버 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DB 행 타입 (snake_case) — Route Handler 내부 전용
type ProjectRow = {
  id: string
  title: string
  description: string
  tech_stack: string[]
  thumbnail_url: string
  display_order: number
  updated_at: string | null
}

function rowToProjectData(row: ProjectRow): ProjectData {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    techStack: row.tech_stack,
    thumbnailUrl: row.thumbnail_url,
    displayOrder: row.display_order,
  }
}

type RouteContext = { params: Promise<{ id: string }> }

// PATCH: 프로젝트 수정
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
    const { title, description, techStack, thumbnailUrl, displayOrder } = body as {
      title?: string
      description?: string
      techStack?: string[]
      thumbnailUrl?: string
      displayOrder?: number
    }

    // 수정할 필드만 업데이트 (부분 업데이트 지원)
    const updatePayload: Record<string, unknown> = {}
    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json({ error: 'title은 빈 값일 수 없습니다' }, { status: 400 })
      }
      updatePayload.title = title.trim()
    }
    if (description !== undefined) updatePayload.description = description.trim()
    if (techStack !== undefined) updatePayload.tech_stack = techStack
    if (thumbnailUrl !== undefined) updatePayload.thumbnail_url = thumbnailUrl.trim()
    if (displayOrder !== undefined) updatePayload.display_order = displayOrder

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(updatePayload)
      .eq('id', id)
      .select('id, title, description, tech_stack, thumbnail_url, display_order, updated_at')
      .single()

    if (error) {
      console.error('[api/admin/projects PATCH] 수정 실패:', error.message)
      return NextResponse.json({ error: '프로젝트 수정 실패: ' + error.message }, { status: 500 })
    }

    const project: ProjectData = rowToProjectData(data as ProjectRow)
    return NextResponse.json({ data: project })
  } catch (err) {
    console.error('[api/admin/projects PATCH] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// DELETE: 프로젝트 삭제
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

    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)

    if (error) {
      console.error('[api/admin/projects DELETE] 삭제 실패:', error.message)
      return NextResponse.json({ error: '프로젝트 삭제 실패: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('[api/admin/projects DELETE] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
