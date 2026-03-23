export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'

type RouteContext = { params: Promise<{ filename: string }> }

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    // 세션 검증 (NFR-S3)
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // filename URL 디코딩 (source_file 값은 URL에서 인코딩되어 전달됨)
    const { filename } = await context.params
    const sourceFile = decodeURIComponent(filename)

    if (!sourceFile || sourceFile.trim().length === 0) {
      return NextResponse.json(
        { error: '소스 파일명이 비어 있습니다' },
        { status: 400 }
      )
    }

    // Service Role 클라이언트 (RLS 우회)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // source_file 기준 전체 삭제 (FR32)
    const { data, error } = await adminClient
      .from('chatbot_kb')
      .delete()
      .eq('source_file', sourceFile)
      .select('id')

    if (error) {
      console.error('[source/delete] 삭제 오류:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const deleted = data?.length ?? 0
    return NextResponse.json({ data: { deleted } })
  } catch (err) {
    console.error('[api/admin/chatbot-kb/source/[filename]] 에러:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
