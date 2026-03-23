/**
 * chatbot_kb 시드 데이터 임베딩 스크립트
 * 실행: npx tsx scripts/seed-embeddings.ts
 */
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@supabase/supabase-js'

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!GOOGLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing env vars: GOOGLE_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const genai = new GoogleGenAI({ apiKey: GOOGLE_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function main() {
  // 임베딩 없는 레코드 조회
  const { data: rows, error } = await supabase
    .from('chatbot_kb')
    .select('id, content')
    .is('embedding', null)

  if (error) {
    console.error('Supabase 조회 실패:', error.message)
    process.exit(1)
  }

  if (!rows || rows.length === 0) {
    console.log('임베딩할 레코드가 없습니다.')
    return
  }

  console.log(`${rows.length}개 레코드 임베딩 시작...`)

  for (const row of rows) {
    try {
      const response = await genai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: [{ parts: [{ text: row.content }] }],
        config: { outputDimensionality: 768 },
      })
      const vector = response.embeddings?.[0]?.values

      if (!vector) {
        console.error(`[${row.id}] 임베딩 실패: 벡터 없음`)
        continue
      }

      const { error: updateError } = await supabase
        .from('chatbot_kb')
        .update({ embedding: JSON.stringify(vector) })
        .eq('id', row.id)

      if (updateError) {
        console.error(`[${row.id}] 업데이트 실패:`, updateError.message)
      } else {
        console.log(`[${row.id}] 임베딩 완료 (${vector.length}차원)`)
      }
    } catch (err) {
      console.error(`[${row.id}] 임베딩 에러:`, (err as Error).message)
    }
  }

  console.log('완료!')
}

main()
