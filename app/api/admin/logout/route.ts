export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-admin'

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient()

    // 세션 검증
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // 로그아웃
    const { error } = await supabase.auth.signOut()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[api/admin/logout] 에러:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
