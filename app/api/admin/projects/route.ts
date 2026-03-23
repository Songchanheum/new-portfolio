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
  project_url: string
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
    projectUrl: row.project_url,
    displayOrder: row.display_order,
  }
}

// GET: 프로젝트 목록 조회 (display_order ASC)
export async function GET() {
  try {
    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select('id, title, description, tech_stack, thumbnail_url, project_url, display_order, updated_at')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[api/admin/projects GET] 조회 실패:', error.message)
      return NextResponse.json({ error: '프로젝트 목록 조회 실패' }, { status: 500 })
    }

    const projects: ProjectData[] = (data as ProjectRow[]).map(rowToProjectData)
    return NextResponse.json({ data: projects })
  } catch (err) {
    console.error('[api/admin/projects GET] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// POST: 새 프로젝트 생성
export async function POST(req: Request) {
  try {
    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, techStack, thumbnailUrl, projectUrl, displayOrder } = body as {
      title: string
      description?: string
      techStack?: string[]
      thumbnailUrl?: string
      projectUrl?: string
      displayOrder?: number
    }

    // 필수 필드 검증
    if (!title || !title.trim()) {
      return NextResponse.json({ error: 'title은 필수입니다' }, { status: 400 })
    }

    // id는 서버에서 생성 (crypto.randomUUID)
    const newId = crypto.randomUUID()

    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert({
        id: newId,
        title: title.trim(),
        description: (description ?? '').trim(),
        tech_stack: techStack ?? [],
        thumbnail_url: (thumbnailUrl ?? '').trim(),
        project_url: (projectUrl ?? '').trim(),
        display_order: displayOrder ?? 0,
      })
      .select('id, title, description, tech_stack, thumbnail_url, project_url, display_order, updated_at')
      .single()

    if (error) {
      console.error('[api/admin/projects POST] 생성 실패:', error.message)
      return NextResponse.json({ error: '프로젝트 생성 실패: ' + error.message }, { status: 500 })
    }

    const project: ProjectData = rowToProjectData(data as ProjectRow)
    return NextResponse.json({ data: project }, { status: 201 })
  } catch (err) {
    console.error('[api/admin/projects POST] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
