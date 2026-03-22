/**
 * chatbot_kb 테이블에서 embedding이 NULL인 행을 조회하고
 * Gemini embedding-001 모델로 768차원 벡터를 생성한 뒤 업데이트합니다.
 *
 * 실행: node --env-file=.env.local supabase/generate-embeddings.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { GoogleGenAI } from '@google/genai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const gemini = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
const EMBEDDING_MODEL = 'gemini-embedding-001'

async function generateEmbedding(text) {
  const res = await gemini.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: [{ parts: [{ text }] }],
    config: { outputDimensionality: 768 },
  })
  return res.embeddings?.[0]?.values ?? null
}

async function main() {
  console.log('chatbot_kb 임베딩 생성 시작...')

  const { data: rows, error } = await supabase
    .from('chatbot_kb')
    .select('id, content')
    .is('embedding', null)

  if (error) {
    console.error('조회 실패:', error.message)
    process.exit(1)
  }

  console.log(`임베딩 필요 행 수: ${rows.length}`)

  for (const row of rows) {
    process.stdout.write(`  [${row.id}] 임베딩 생성 중...`)
    const embedding = await generateEmbedding(row.content)

    if (!embedding) {
      console.log(' 실패 (벡터 없음)')
      continue
    }

    const { error: updateErr } = await supabase
      .from('chatbot_kb')
      .update({ embedding })
      .eq('id', row.id)

    if (updateErr) {
      console.log(` 업데이트 실패: ${updateErr.message}`)
    } else {
      console.log(` 완료 (${embedding.length}차원)`)
    }
  }

  console.log('\n임베딩 생성 완료.')
}

main()
