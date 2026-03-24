/**
 * 대내외 활동(activities) 시드 삽입 — supabase/migrate-activities-seed.sql 과 동일 데이터
 * 실행: node scripts/migrate-activities-seed.mjs
 *
 * .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
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

const TITLES = [
  'Oracle AI Summit 체험 부스 운영',
  'AI x SOFTWAVE 2026 AI 부스 운영',
  '원티드 프리온보딩 프론트엔드 챌린지 6월',
  '원티드 프리온보딩 프론트엔드 챌린지 3월',
  '소프트웨어 교육 과정 이수',
  'AI SW 온라인 코딩입문훈련 교육과정',
  '사물인터넷(IoT)기반 스마트 웹&앱 개발자 과정',
  '안양대학교 정보통신공학과',
]

const ROWS = [
  {
    title: 'Oracle AI Summit 체험 부스 운영',
    date: '2026-02-03',
    description: 'Oracle · ITCEN Cloit AI AgentGO 2026 플랫폼 설명 및 체험 부스 운영',
    blog_url: '',
    display_order: 0,
  },
  {
    title: 'AI x SOFTWAVE 2026 AI 부스 운영',
    date: '2025-12-03',
    description: '소프트웨이브 · 아이티센 AI 플랫폼 Think API 설명 부스 운영',
    blog_url: '',
    display_order: 1,
  },
  {
    title: '원티드 프리온보딩 프론트엔드 챌린지 6월',
    date: '2024-06-01',
    description: '2024.06 ~ 2024.06 | 원티드 | React 실전: React Hook과 spa 실전개발',
    blog_url: '',
    display_order: 2,
  },
  {
    title: '원티드 프리온보딩 프론트엔드 챌린지 3월',
    date: '2024-03-01',
    description:
      '2024.03 ~ 2024.04 | 원티드 | React 실전 가이드: 면접 및 실무 기술 프리온보딩 프론트엔드 챌린지',
    blog_url: '',
    display_order: 3,
  },
  {
    title: '소프트웨어 교육 과정 이수',
    date: '2022-11-02',
    description: '정보통신산업진흥원 | AI SW 온라인 코딩입문훈련 교육과정 이수증 취득',
    blog_url: '',
    display_order: 4,
  },
  {
    title: 'AI SW 온라인 코딩입문훈련 교육과정',
    date: '2022-08-01',
    description:
      '2022.08 ~ 2022.11 | 정보통신산업진흥원 | 핵심 HTML/CSS 기초, 핵심 JavaScript 기초, Node.js와 Express.js, Express.js와 MongoDB, 웹 개발 포트폴리오 만들기 프로젝트',
    blog_url: '',
    display_order: 5,
  },
  {
    title: '사물인터넷(IoT)기반 스마트 웹&앱 개발자 과정',
    date: '2016-06-01',
    description:
      '2016.06 ~ 2017.01 | 한국정보과학진흥협회 | 국비지원 교육 이수 (HTML/CSS, javascript, JAVA - Swing, Hadoop, Android, Arduino)',
    blog_url: '',
    display_order: 6,
  },
  {
    title: '안양대학교 정보통신공학과',
    date: '2011-03-01',
    description: '2011.03 ~ 2017.02 | 졸업 (학점: 3.5/4.5)',
    blog_url: '',
    display_order: 7,
  },
]

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function migrate() {
  const { error: delError } = await supabase.from('activities').delete().in('title', TITLES)
  if (delError) {
    console.error('❌ 기존 행 삭제 실패:', delError.message)
    process.exit(1)
  }

  const { error: insError } = await supabase.from('activities').insert(ROWS)
  if (insError) {
    console.error('❌ 삽입 실패:', insError.message)
    process.exit(1)
  }

  console.log('🎉 activities 8건 마이그레이션 완료 (/resume/activities)')
}

migrate()
