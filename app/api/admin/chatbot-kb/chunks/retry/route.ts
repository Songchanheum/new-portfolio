export const runtime = 'nodejs'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import { GoogleGenAI } from '@google/genai'

const BATCH_SIZE = 10
const BATCH_DELAY_MS = 1000
const MAX_IDS = 50

async function generateEmbedding(text: string): Promise<number[]> {
  const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
  const result = await genAI.models.embedContent({
    model: 'gemini-embedding-001',
    contents: text,
  })
  return result.embeddings?.[0]?.values ?? []
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface ChunkRow {
  id: string
  content: string
}

export async function POST(request: NextRequest) {
  try {
    // 세션 검증 (NFR-S3)
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // body 파싱
    const body = (await request.json()) as { ids?: unknown }
    const ids = body.ids

    // ids 배열 검증
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: '재시도할 청크 ID 배열이 비어 있거나 잘못된 형식입니다' },
        { status: 400 }
      )
    }

    // 최대 50개 제한 (AC7)
    if (ids.length > MAX_IDS) {
      return NextResponse.json(
        { error: `한 번에 최대 ${MAX_IDS}개까지만 재시도할 수 있습니다` },
        { status: 400 }
      )
    }

    // 문자열 배열인지 검증
    const validIds = ids.filter((id): id is string => typeof id === 'string' && id.length > 0)
    if (validIds.length !== ids.length) {
      return NextResponse.json(
        { error: 'ids 배열에 유효하지 않은 값이 포함되어 있습니다' },
        { status: 400 }
      )
    }

    // Service Role 클라이언트 (RLS 우회)
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 재시도 대상 청크의 content 조회
    const { data: chunks, error: fetchError } = await adminClient
      .from('chatbot_kb')
      .select('id, content')
      .in('id', validIds)

    if (fetchError) {
      console.error('[retry] 청크 조회 오류:', fetchError.message)
      return NextResponse.json({ error: fetchError.message }, { status: 500 })
    }

    if (!chunks || chunks.length === 0) {
      return NextResponse.json(
        { error: '재시도할 청크를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    const typedChunks = chunks as ChunkRow[]

    // 처리 전 전체 status='processing' 업데이트
    const chunkIds = typedChunks.map((c) => c.id)
    await adminClient.from('chatbot_kb').update({ status: 'processing' }).in('id', chunkIds)

    // 배치 처리 결과 카운터
    let completed = 0
    let failed = 0

    // 10개씩 배치로 나눠 처리 (Story 2.2와 동일한 로직)
    for (let i = 0; i < typedChunks.length; i += BATCH_SIZE) {
      const batch = typedChunks.slice(i, i + BATCH_SIZE)

      // 배치 내 청크를 병렬 처리
      const batchResults = await Promise.allSettled(
        batch.map(async (chunk) => {
          const embedding = await generateEmbedding(chunk.content)

          const { error: updateError } = await adminClient
            .from('chatbot_kb')
            .update({
              status: 'completed',
              embedding: JSON.stringify(embedding),
            })
            .eq('id', chunk.id)

          if (updateError) {
            throw new Error(updateError.message)
          }
        })
      )

      // 배치 결과 집계 및 실패 청크 status 업데이트
      for (let j = 0; j < batchResults.length; j++) {
        const result = batchResults[j]
        if (result.status === 'fulfilled') {
          completed++
        } else {
          failed++
          // 실패: status='failed' 업데이트 (NFR-R1 — 성공 청크 데이터 유실 방지)
          console.error(`[retry] 청크 ${batch[j].id} 임베딩 실패:`, result.reason)
          await adminClient
            .from('chatbot_kb')
            .update({ status: 'failed' })
            .eq('id', batch[j].id)
        }
      }

      // 마지막 배치가 아닐 경우 딜레이 (Rate Limit 대응)
      if (i + BATCH_SIZE < typedChunks.length) {
        await delay(BATCH_DELAY_MS)
      }
    }

    // 처리 결과 반환 (FR34 — 성공/실패 수 명확히 표시)
    return NextResponse.json({ total: typedChunks.length, completed, failed })
  } catch (err) {
    console.error('[api/admin/chatbot-kb/chunks/retry] 에러:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
