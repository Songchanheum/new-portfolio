export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import { GoogleGenAI } from '@google/genai'

// Service Role 클라이언트 — RLS 우회, 서버 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// chatbot_kb 행 타입 (embedding 제외하여 응답 크기 절감)
type ChunkRow = {
  id: number
  content: string
  source_file: string | null
  status: string
  created_at: string
}

type RouteContext = { params: Promise<{ id: string }> }

// PATCH: 청크 텍스트 편집 + 재임베딩
export async function PATCH(request: Request, context: RouteContext) {
  try {
    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    const { id } = await context.params
    const chunkId = parseInt(id, 10)
    if (isNaN(chunkId)) {
      return NextResponse.json({ error: '유효하지 않은 청크 ID' }, { status: 400 })
    }

    // body 파싱
    const body: unknown = await request.json()
    if (
      typeof body !== 'object' ||
      body === null ||
      !('content' in body) ||
      typeof (body as Record<string, unknown>).content !== 'string'
    ) {
      return NextResponse.json({ error: '잘못된 요청 형식' }, { status: 400 })
    }
    const { content } = body as { content: string }

    // 빈 문자열 검증
    if (content.trim() === '') {
      return NextResponse.json({ error: '내용을 입력하세요' }, { status: 400 })
    }

    // 1단계: status를 'processing'으로 업데이트 (재임베딩 시작 표시)
    const { error: processingError } = await supabaseAdmin
      .from('chatbot_kb')
      .update({ status: 'processing', content: content.trim() })
      .eq('id', chunkId)

    if (processingError) {
      console.error('[api/admin/chatbot-kb/chunks PATCH] processing 업데이트 실패:', processingError.message)
      return NextResponse.json({ error: processingError.message }, { status: 500 })
    }

    // 2단계: Google AI로 재임베딩 생성
    try {
      const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
      const result = await genAI.models.embedContent({
        model: 'gemini-embedding-001',
        contents: content.trim(),
      })
      const embedding: number[] = result.embeddings?.[0]?.values ?? []

      // 3단계: 임베딩 저장 + status를 'completed'로 업데이트
      const { data: updatedRows, error: updateError } = await supabaseAdmin
        .from('chatbot_kb')
        .update({
          status: 'completed',
          embedding,
        })
        .eq('id', chunkId)
        .select('id, content, source_file, status, created_at')

      if (updateError) {
        console.error('[api/admin/chatbot-kb/chunks PATCH] 임베딩 저장 실패:', updateError.message)
        // 임베딩 저장 실패 시 status를 'failed'로 마킹 (데이터 유실 방지 — NFR-R1)
        await supabaseAdmin
          .from('chatbot_kb')
          .update({ status: 'failed' })
          .eq('id', chunkId)
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      const updatedChunk = updatedRows?.[0] as ChunkRow | undefined
      return NextResponse.json({ data: updatedChunk ?? null })
    } catch (embeddingErr) {
      // 임베딩 API 오류 시 status를 'failed'로 마킹 (NFR-R1)
      console.error('[api/admin/chatbot-kb/chunks PATCH] 임베딩 생성 실패:', (embeddingErr as Error).message)
      await supabaseAdmin
        .from('chatbot_kb')
        .update({ status: 'failed' })
        .eq('id', chunkId)
      return NextResponse.json(
        { error: `재임베딩 실패: ${(embeddingErr as Error).message}` },
        { status: 500 }
      )
    }
  } catch (err) {
    console.error('[api/admin/chatbot-kb/chunks PATCH] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}

// DELETE: 개별 청크 삭제
export async function DELETE(_request: Request, context: RouteContext) {
  try {
    // NFR-S3: 요청마다 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    const { id } = await context.params
    const chunkId = parseInt(id, 10)
    if (isNaN(chunkId)) {
      return NextResponse.json({ error: '유효하지 않은 청크 ID' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('chatbot_kb')
      .delete()
      .eq('id', chunkId)

    if (error) {
      console.error('[api/admin/chatbot-kb/chunks DELETE] 삭제 실패:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: { id: chunkId } })
  } catch (err) {
    console.error('[api/admin/chatbot-kb/chunks DELETE] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
