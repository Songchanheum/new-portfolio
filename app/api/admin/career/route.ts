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

// DB 행 타입 (snake_case) — 컴포넌트 외부 공유 불필요, Route Handler 내부 전용
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

// GET: 경력 목록 조회 (display_order ASC)
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
      .from('career')
      .select('id, company, role, period, description, display_order, updated_at')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[api/admin/career GET] 조회 실패:', error.message)
      return NextResponse.json({ error: '경력 목록 조회 실패' }, { status: 500 })
    }

    const items: CareerData[] = (data as CareerRow[]).map(rowToCareerData)
    return NextResponse.json({ data: items })
  } catch (err) {
    console.error('[api/admin/career GET] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// POST: 새 경력 항목 생성
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
    const { company, role, period, description, displayOrder } = body as {
      company: string
      role: string
      period: string
      description?: string
      displayOrder?: number
    }

    // 필수 필드 검증
    if (!company || !role || !period) {
      return NextResponse.json(
        { error: 'company, role, period는 필수입니다' },
        { status: 400 }
      )
    }

    // id는 서버에서 생성 (career 테이블 id는 TEXT 타입)
    const newId = crypto.randomUUID()

    const { data, error } = await supabaseAdmin
      .from('career')
      .insert({
        id: newId,
        company: company.trim(),
        role: role.trim(),
        period: period.trim(),
        description: (description ?? '').trim(),
        display_order: displayOrder ?? 0,
      })
      .select('id, company, role, period, description, display_order, updated_at')
      .single()

    if (error) {
      console.error('[api/admin/career POST] 생성 실패:', error.message)
      return NextResponse.json({ error: '경력 항목 생성 실패: ' + error.message }, { status: 500 })
    }

    const item: CareerData = rowToCareerData(data as CareerRow)
    return NextResponse.json({ data: item }, { status: 201 })
  } catch (err) {
    console.error('[api/admin/career POST] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
