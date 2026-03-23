// Vercel Node.js 런타임 사용 (임베딩 처리 및 maxDuration 설정을 위해 필수)
export const runtime = 'nodejs'
// Vercel 프로 플랜 최대 60초 제한 — 대용량 파일 배치 처리를 위해 설정
export const maxDuration = 60

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'
import { geminiClient, EMBEDDING_MODEL } from '@/lib/gemini'

// Service Role로 RLS 우회 — admin API 전용 클라이언트
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 파일 크기 제한: 1MB
const MAX_FILE_SIZE = 1 * 1024 * 1024

// 배치 처리 설정
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 1000

/**
 * 텍스트를 단어 단위로 청크 분할한다.
 * overlap으로 인접 청크 간 문맥 연속성 확보.
 */
function splitIntoChunks(text: string, chunkSize: number, overlap: number): string[] {
  const words = text.split(/\s+/).filter(w => w.length > 0)
  const chunks: string[] = []
  let i = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim()) chunks.push(chunk)
    i += chunkSize - overlap
  }
  return chunks
}

/**
 * 배치 간 딜레이 — Google AI Rate Limit 방지
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function POST(req: Request) {
  try {
    // ------- 1. 세션 검증 (NFR-S3) -------
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // ------- 2. multipart/form-data 파싱 -------
    let formData: FormData
    try {
      formData = await req.formData()
    } catch {
      return NextResponse.json({ error: '파일 업로드 형식이 올바르지 않습니다' }, { status: 400 })
    }

    const file = formData.get('file')
    const chunkSizeRaw = formData.get('chunkSize')
    const overlapRaw = formData.get('overlap')

    // ------- 3. 파일 검증 -------
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
    }

    // 확장자 검증: .txt / .md 만 허용
    const filename = file.name
    const ext = filename.split('.').pop()?.toLowerCase()
    if (ext !== 'txt' && ext !== 'md') {
      return NextResponse.json(
        { error: '.txt 또는 .md 파일만 업로드할 수 있습니다' },
        { status: 400 }
      )
    }

    // 파일 크기 검증: 최대 1MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `파일 크기는 1MB 이하여야 합니다 (현재: ${(file.size / 1024 / 1024).toFixed(2)}MB)` },
        { status: 400 }
      )
    }

    // chunkSize / overlap 파싱 (기본값 적용)
    const chunkSize = chunkSizeRaw ? Math.max(1, parseInt(String(chunkSizeRaw), 10) || 500) : 500
    const overlap = overlapRaw ? Math.max(0, parseInt(String(overlapRaw), 10) || 50) : 50

    // overlap은 chunkSize보다 작아야 함
    const safeOverlap = Math.min(overlap, chunkSize - 1)

    // ------- 4. 파일 텍스트 추출 -------
    const text = await file.text()
    if (!text.trim()) {
      return NextResponse.json({ error: '파일 내용이 비어있습니다' }, { status: 400 })
    }

    // ------- 5. 청크 분할 -------
    const chunks = splitIntoChunks(text, chunkSize, safeOverlap)
    if (chunks.length === 0) {
      return NextResponse.json({ error: '유효한 텍스트 청크를 생성할 수 없습니다' }, { status: 400 })
    }

    console.log(`[upload] 파일: ${filename}, 청크 수: ${chunks.length}, chunkSize: ${chunkSize}, overlap: ${safeOverlap}`)

    // ------- 6. chatbot_kb INSERT (status='pending') -------
    // 모든 청크를 pending 상태로 먼저 저장 — 부분 실패 시 데이터 유실 방지 (NFR-R1)
    const insertRows = chunks.map(chunk => ({
      content: chunk,
      source_file: filename,
      status: 'pending',
      embedding: null,
    }))

    const { data: insertedRows, error: insertError } = await supabaseAdmin
      .from('chatbot_kb')
      .insert(insertRows)
      .select('id')

    if (insertError || !insertedRows) {
      console.error('[upload] DB INSERT 실패:', insertError?.message)
      return NextResponse.json(
        { error: `청크 저장 실패: ${insertError?.message ?? '알 수 없는 오류'}` },
        { status: 500 }
      )
    }

    const insertedIds = insertedRows.map(row => row.id as string)

    // ------- 7. 배치 임베딩 처리 -------
    let completed = 0
    let failed = 0

    // 10개 단위 배치로 처리
    for (let batchStart = 0; batchStart < chunks.length; batchStart += BATCH_SIZE) {
      const batchChunks = chunks.slice(batchStart, batchStart + BATCH_SIZE)
      const batchIds = insertedIds.slice(batchStart, batchStart + BATCH_SIZE)

      console.log(`[upload] 배치 처리 중: ${batchStart + 1}~${batchStart + batchChunks.length} / ${chunks.length}`)

      // 배치 내 각 청크 처리 (개별 try/catch — 부분 실패 허용)
      for (let i = 0; i < batchChunks.length; i++) {
        const chunkContent = batchChunks[i]
        const chunkId = batchIds[i]

        // processing 상태로 업데이트
        await supabaseAdmin
          .from('chatbot_kb')
          .update({ status: 'processing' })
          .eq('id', chunkId)

        try {
          // Google AI 임베딩 생성 (기존 lib/gemini.ts 패턴 재활용)
          const embeddingResponse = await geminiClient.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: [{ parts: [{ text: chunkContent }] }],
            config: { outputDimensionality: 768 },
          })

          const vector = embeddingResponse.embeddings?.[0]?.values

          if (!vector || vector.length === 0) {
            throw new Error('임베딩 벡터가 비어있습니다')
          }

          // 임베딩 성공: completed 상태 + 벡터 저장
          await supabaseAdmin
            .from('chatbot_kb')
            .update({
              status: 'completed',
              embedding: vector,
            })
            .eq('id', chunkId)

          completed++
        } catch (embeddingError) {
          // 임베딩 실패: failed 마킹 후 계속 진행 (NFR-R1 부분 실패 허용)
          console.error(`[upload] 청크 임베딩 실패 (id: ${chunkId}):`, (embeddingError as Error).message)

          await supabaseAdmin
            .from('chatbot_kb')
            .update({ status: 'failed' })
            .eq('id', chunkId)

          failed++
        }
      }

      // 마지막 배치가 아니면 딜레이 적용 (Rate Limit 방지)
      if (batchStart + BATCH_SIZE < chunks.length) {
        await delay(BATCH_DELAY_MS)
      }
    }

    // ------- 8. 결과 반환 -------
    const pending = chunks.length - completed - failed
    const result = {
      total: chunks.length,
      completed,
      failed,
      pending,
    }

    console.log(`[upload] 완료 — total: ${result.total}, completed: ${result.completed}, failed: ${result.failed}`)

    return NextResponse.json(result)
  } catch (err) {
    console.error('[api/admin/chatbot-kb/upload] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
