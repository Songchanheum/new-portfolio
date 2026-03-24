/**
 * 마지막 카드(topic / id: card-4) keyword·detail을 lib/topic-card-seed.ts 기준으로 DB에 반영
 * 실행: node scripts/migrate-card-topic.mjs
 *
 * 주의: SUPABASE_SERVICE_ROLE_KEY 필요 (.env.local)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim()]
    }),
)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 .env.local에 없습니다.')
  process.exit(1)
}

const seedPath = resolve(__dirname, '../lib/topic-card-seed.ts')
const seedSrc = readFileSync(seedPath, 'utf-8')

const kwMatch = seedSrc.match(/export const TOPIC_CARD_KEYWORD\s*=\s*\n\s*'([^']*)'/)
if (!kwMatch) {
  console.error('❌ lib/topic-card-seed.ts 에서 TOPIC_CARD_KEYWORD 를 파싱하지 못했습니다.')
  process.exit(1)
}
const keyword = kwMatch[1]

const detailMatch = seedSrc.match(/export const TOPIC_CARD_DETAIL_HTML = `([\s\S]*?)`\s*\.trim\(\)/)
if (!detailMatch) {
  console.error('❌ lib/topic-card-seed.ts 에서 TOPIC_CARD_DETAIL_HTML 을 파싱하지 못했습니다.')
  process.exit(1)
}
const detail = detailMatch[1].trim()

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function migrate() {
  const { data: row, error: fetchError } = await supabase
    .from('cards')
    .select('id, keyword')
    .eq('id', 'card-4')
    .maybeSingle()

  if (fetchError) {
    console.error('❌ 카드 조회 실패:', fetchError.message)
    process.exit(1)
  }

  if (!row) {
    console.error('❌ id가 card-4인 카드가 없습니다. Supabase에 카드 행을 먼저 넣어 주세요.')
    process.exit(1)
  }

  const { error: updateError } = await supabase
    .from('cards')
    .update({ keyword, detail })
    .eq('id', 'card-4')

  if (updateError) {
    console.error('❌ 업데이트 실패:', updateError.message)
    process.exit(1)
  }

  console.log('🎉 card-4 (topic) 마이그레이션 완료')
  console.log(`   keyword: ${keyword}`)
  console.log(`   detail: ${detail.length} chars HTML`)
}

migrate()
