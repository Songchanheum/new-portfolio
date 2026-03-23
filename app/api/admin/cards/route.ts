export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { CardData, CardType } from '@/types'

// Service Role 클라이언트 — RLS 우회, 서버 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// DB 행 타입 (snake_case) — Route Handler 내부 전용
type CardRow = {
  id: string
  type: CardType
  keyword: string
  detail: string
  display_order: number
  updated_at: string | null
}

function rowToCardData(row: CardRow): CardData {
  return {
    id: row.id,
    type: row.type,
    keyword: row.keyword,
    detail: row.detail,
    displayOrder: row.display_order,
  }
}

// GET: 카드 목록 조회 (display_order ASC)
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
      .from('cards')
      .select('id, type, keyword, detail, display_order, updated_at')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('[api/admin/cards GET] 조회 실패:', error.message)
      return NextResponse.json({ error: '카드 목록 조회 실패' }, { status: 500 })
    }

    const cards: CardData[] = (data as CardRow[]).map(rowToCardData)
    return NextResponse.json({ data: cards })
  } catch (err) {
    console.error('[api/admin/cards GET] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// POST: 새 카드 생성
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
    const { type, keyword, detail, displayOrder } = body as {
      type: CardType
      keyword: string
      detail: string
      displayOrder: number
    }

    // 필수 필드 검증
    if (!type || !keyword) {
      return NextResponse.json({ error: 'type과 keyword는 필수입니다' }, { status: 400 })
    }

    const VALID_TYPES: CardType[] = ['intro', 'developer', 'career', 'projects', 'topic']
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: '유효하지 않은 카드 타입입니다' }, { status: 400 })
    }

    const newId = crypto.randomUUID()

    const { data, error } = await supabaseAdmin
      .from('cards')
      .insert({
        id: newId,
        type,
        keyword: keyword.trim(),
        detail: (detail ?? '').trim(),
        display_order: displayOrder ?? 0,
      })
      .select('id, type, keyword, detail, display_order, updated_at')
      .single()

    if (error) {
      console.error('[api/admin/cards POST] 생성 실패:', error.message)
      return NextResponse.json({ error: '카드 생성 실패: ' + error.message }, { status: 500 })
    }

    const card: CardData = rowToCardData(data as CardRow)
    return NextResponse.json({ data: card }, { status: 201 })
  } catch (err) {
    console.error('[api/admin/cards POST] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
