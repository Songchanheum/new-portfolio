export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { CareerDetailData } from '@/types'

// Service Role 클라이언트 — RLS 우회, 서버 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const CAREER_SELECT = 'id, company, company_url, role, period, description, detail_description, achievements, career_tech_stack, display_order, updated_at'

type CareerRow = {
  id: string
  company: string
  company_url: string
  role: string
  period: string
  description: string
  detail_description: string
  achievements: string[]
  career_tech_stack: string[]
  display_order: number
  updated_at: string | null
}

function rowToCareerData(row: CareerRow): CareerDetailData {
  return {
    id: row.id,
    company: row.company,
    companyUrl: row.company_url,
    role: row.role,
    period: row.period,
    description: row.description,
    displayOrder: row.display_order,
    detailDescription: row.detail_description ?? '',
    achievements: row.achievements ?? [],
    careerTechStack: row.career_tech_stack ?? [],
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
      .select(CAREER_SELECT)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[api/admin/career GET] 조회 실패:', error.message)
      return NextResponse.json({ error: '경력 목록 조회 실패' }, { status: 500 })
    }

    const items: CareerDetailData[] = (data as CareerRow[]).map(rowToCareerData)
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
    const { company, companyUrl, role, period, description, detailDescription, achievements, careerTechStack, displayOrder } = body as {
      company: string
      companyUrl?: string
      role: string
      period: string
      description?: string
      detailDescription?: string
      achievements?: string[]
      careerTechStack?: string[]
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
        company_url: (companyUrl ?? '').trim(),
        role: role.trim(),
        period: period.trim(),
        description: (description ?? '').trim(),
        detail_description: (detailDescription ?? '').trim(),
        achievements: achievements ?? [],
        career_tech_stack: careerTechStack ?? [],
        display_order: displayOrder ?? 0,
      })
      .select(CAREER_SELECT)
      .single()

    if (error) {
      console.error('[api/admin/career POST] 생성 실패:', error.message)
      return NextResponse.json({ error: '경력 항목 생성 실패: ' + error.message }, { status: 500 })
    }

    const item: CareerDetailData = rowToCareerData(data as CareerRow)
    return NextResponse.json({ data: item }, { status: 201 })
  } catch (err) {
    console.error('[api/admin/career POST] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
