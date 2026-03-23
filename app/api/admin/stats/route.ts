export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import type { AdminStats } from '@/types'

// Service Role 클라이언트 — RLS 우회, 서버 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // 4개 테이블 동시 조회 (병렬 처리로 성능 최적화)
    const [cardsResult, careerResult, projectsResult, chatbotKbResult] = await Promise.all([
      supabaseAdmin
        .from('cards')
        .select('updated_at', { count: 'exact', head: false })
        .order('updated_at', { ascending: false })
        .limit(1),
      supabaseAdmin
        .from('career')
        .select('updated_at', { count: 'exact', head: false })
        .order('updated_at', { ascending: false })
        .limit(1),
      supabaseAdmin
        .from('projects')
        .select('updated_at', { count: 'exact', head: false })
        .order('updated_at', { ascending: false })
        .limit(1),
      supabaseAdmin
        .from('chatbot_kb')
        .select('created_at', { count: 'exact', head: false })
        .order('created_at', { ascending: false })
        .limit(1),
    ])

    // 에러 로깅 (개별 테이블 에러는 전체 실패로 처리하지 않음)
    if (cardsResult.error) console.error('[api/admin/stats] cards 조회 실패:', cardsResult.error.message)
    if (careerResult.error) console.error('[api/admin/stats] career 조회 실패:', careerResult.error.message)
    if (projectsResult.error) console.error('[api/admin/stats] projects 조회 실패:', projectsResult.error.message)
    if (chatbotKbResult.error) console.error('[api/admin/stats] chatbot_kb 조회 실패:', chatbotKbResult.error.message)

    const stats: AdminStats = {
      cards: {
        count: cardsResult.count ?? 0,
        lastModified: cardsResult.data?.[0]?.updated_at ?? null,
      },
      career: {
        count: careerResult.count ?? 0,
        lastModified: careerResult.data?.[0]?.updated_at ?? null,
      },
      projects: {
        count: projectsResult.count ?? 0,
        lastModified: projectsResult.data?.[0]?.updated_at ?? null,
      },
      chatbotKb: {
        count: chatbotKbResult.count ?? 0,
        lastModified: chatbotKbResult.data?.[0]?.created_at ?? null,
      },
    }

    return NextResponse.json({ data: stats })
  } catch (err) {
    console.error('[api/admin/stats] 에러:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
