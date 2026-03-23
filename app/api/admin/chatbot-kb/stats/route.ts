export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'

// stats API 응답 타입
interface StatsResponse {
  total: number
  byStatus: {
    completed: number
    pending: number
    processing: number
    failed: number
  }
  sourceFiles: Array<{
    source_file: string | null
    count: number
  }>
}

export async function GET() {
  try {
    // 세션 검증 (NFR-S3)
    const supabaseAuth = await createSupabaseServerClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // Service Role 클라이언트 — RLS 우회하여 모든 레코드 조회
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. status별 카운트 조회
    const { data: statusCounts, error: statusError } = await supabaseAdmin
      .from('chatbot_kb')
      .select('status')

    if (statusError) {
      console.error('[api/admin/chatbot-kb/stats] status 조회 오류:', statusError.message)
      return NextResponse.json({ error: statusError.message }, { status: 500 })
    }

    // 클라이언트 사이드 집계 (Supabase RPC 없이 처리)
    const counts = {
      completed: 0,
      pending: 0,
      processing: 0,
      failed: 0,
    }
    const total = statusCounts?.length ?? 0

    for (const row of statusCounts ?? []) {
      const s = row.status as keyof typeof counts
      if (s in counts) counts[s]++
    }

    // 2. source_file별 청크 수 조회
    const { data: allRows, error: sourceError } = await supabaseAdmin
      .from('chatbot_kb')
      .select('source_file')
      .order('source_file', { ascending: true })

    if (sourceError) {
      console.error('[api/admin/chatbot-kb/stats] source_file 조회 오류:', sourceError.message)
      return NextResponse.json({ error: sourceError.message }, { status: 500 })
    }

    // source_file별 집계
    const sourceMap = new Map<string, number>()
    for (const row of allRows ?? []) {
      const key = row.source_file ?? '__null__'
      sourceMap.set(key, (sourceMap.get(key) ?? 0) + 1)
    }

    const sourceFiles = Array.from(sourceMap.entries())
      .map(([key, count]) => ({
        source_file: key === '__null__' ? null : key,
        count,
      }))
      .sort((a, b) => {
        // null은 마지막에
        if (a.source_file === null) return 1
        if (b.source_file === null) return -1
        return a.source_file.localeCompare(b.source_file)
      })

    const responseData: StatsResponse = {
      total,
      byStatus: counts,
      sourceFiles,
    }

    return NextResponse.json({ data: responseData })
  } catch (err) {
    console.error('[api/admin/chatbot-kb/stats] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
