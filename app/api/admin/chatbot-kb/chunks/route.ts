// Route Handler: 청크 목록 조회 (GET)
// NFR-S3: 세션 검증 필수
// NFR-P3: embedding 컬럼 제외, content 200자 제한, 페이지네이션
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // 세션 검증 — NFR-S3
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // query params 파싱
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') ?? ''
    const sourceFile = searchParams.get('source_file') ?? ''
    const status = searchParams.get('status') ?? ''
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') ?? '50', 10)))

    // Service Role 클라이언트 — RLS 우회, 서버 사이드 전용
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // chatbot_kb 쿼리 빌더
    // embedding 컬럼 제외 — 용량 이슈 (NFR-P3)
    // content는 DB에서 substring하지 않고 전체 조회 후 API 레이어에서 slice
    // (Supabase PostgREST는 substring 함수를 직접 지원하지 않으므로)
    let query = adminClient
      .from('chatbot_kb')
      .select('id, content, status, source_file, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })

    // 텍스트 검색 — content 부분 일치 (ilike: 대소문자 무시)
    if (search.trim()) {
      query = query.ilike('content', `%${search.trim()}%`)
    }

    // 소스파일 필터
    if (sourceFile.trim()) {
      query = query.eq('source_file', sourceFile.trim())
    }

    // 상태 필터
    if (status && ['pending', 'processing', 'completed', 'failed'].includes(status)) {
      query = query.eq('status', status)
    }

    // 페이지네이션 — range는 0-based index
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('[api/admin/chatbot-kb/chunks GET] Supabase 오류:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // content를 200자로 자르기 — 미리보기 전용
    const rows = (data ?? []).map((row) => ({
      ...row,
      content: row.content?.slice(0, 200) ?? '',
    }))

    return NextResponse.json({
      data: rows,
      total: count ?? 0,
      page,
      pageSize,
    })
  } catch (err) {
    console.error('[api/admin/chatbot-kb/chunks GET] 예외:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
