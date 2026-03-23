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

type RouteContext = { params: Promise<{ id: string }> }

// PATCH: 카드 수정
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
    const { type, keyword, detail, displayOrder } = body as {
      type?: CardType
      keyword?: string
      detail?: string
      displayOrder?: number
    }

    // 수정할 필드만 업데이트 (부분 업데이트 지원)
    const updatePayload: Record<string, unknown> = {}
    if (type !== undefined) {
      const VALID_TYPES: CardType[] = ['intro', 'developer', 'career', 'projects', 'topic']
      if (!VALID_TYPES.includes(type)) {
        return NextResponse.json({ error: '유효하지 않은 카드 타입입니다' }, { status: 400 })
      }
      updatePayload.type = type
    }
    if (keyword !== undefined) updatePayload.keyword = keyword.trim()
    if (detail !== undefined) updatePayload.detail = detail.trim()
    if (displayOrder !== undefined) updatePayload.display_order = displayOrder

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: '수정할 필드가 없습니다' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('cards')
      .update(updatePayload)
      .eq('id', id)
      .select('id, type, keyword, detail, display_order, updated_at')
      .single()

    if (error) {
      console.error('[api/admin/cards PATCH] 수정 실패:', error.message)
      return NextResponse.json({ error: '카드 수정 실패: ' + error.message }, { status: 500 })
    }

    const card: CardData = rowToCardData(data as CardRow)
    return NextResponse.json({ data: card })
  } catch (err) {
    console.error('[api/admin/cards PATCH] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}

// DELETE: 카드 삭제
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

    const { error } = await supabaseAdmin.from('cards').delete().eq('id', id)

    if (error) {
      console.error('[api/admin/cards DELETE] 삭제 실패:', error.message)
      return NextResponse.json({ error: '카드 삭제 실패: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({ data: { id } })
  } catch (err) {
    console.error('[api/admin/cards DELETE] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
