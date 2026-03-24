/**
 * 프로젝트 상세 설명 마이그레이션 스크립트
 * 실행: node scripts/migrate-project-detail.mjs
 *
 * 주의: SUPABASE_SERVICE_ROLE_KEY가 필요합니다 (.env.local)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// .env.local 파싱
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.includes('=') && !line.startsWith('#'))
    .map(line => {
      const [key, ...rest] = line.split('=')
      return [key.trim(), rest.join('=').trim()]
    })
)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 .env.local에 없습니다.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

// ─── 마이그레이션 대상 ─────────────────────────────────────────
// 아래 TITLE_KEYWORD를 실제 프로젝트 title의 일부로 변경하세요
const TITLE_KEYWORD = 'AI 포트폴리오'

const DETAIL_DESCRIPTION_HTML = `
<h2>프로젝트 소개</h2>
<p>
  이 포트폴리오 사이트는 <strong>"포트폴리오 자체가 능력의 메타 증거"</strong>라는 콘셉트로 설계했습니다.
  기술 스택을 나열하는 대신, 포트폴리오를 보는 경험 자체가 구현 능력을 증명하도록 만들었습니다.
  원통형 3D 캐러셀 인터랙션, Gemini 기반 AI 챗봇, WYSIWYG 리치 콘텐츠 편집,
  Refined Dark Luxury 비주얼 — 이 모든 것이 하나의 일관된 시각 언어로 작동합니다.
</p>

<h2>핵심 목표</h2>
<p>
  채용 담당자 또는 개발팀장이 첫 화면을 봤을 때 <strong>"이 사람 다르다"</strong>는 인상을 남기는 것.
  단순히 기능이 많은 포트폴리오가 아니라, <em>미적 판단력과 기술 실행력을 동시에 증명하는 결과물</em>을 목표로 했습니다.
  대부분의 개발자 포트폴리오가 Bootstrap 다크테마나 glassmorphism으로 수렴하는 상황에서,
  트렌드 효과 없이 그림자 깊이와 단일 액센트 컬러만으로 고급스러움을 구현했습니다.
</p>

<h2>주요 기능</h2>
<ul>
  <li>
    <strong>원통형 3D 캐러셀</strong> —
    CSS <code>preserve-3d</code> + Framer Motion spring으로 구현한 원통 회전 캐러셀.
    드래그 · 휠 스크롤 · AI 챗봇 연동 포커싱을 지원하며, 마우스 위치에 따라 카드가 미세하게 틸트됩니다.
    진입 시 카드들이 흩어진 위치에서 모이는 스캐터 애니메이션으로 첫인상을 연출합니다.
  </li>
  <li>
    <strong>AI 챗봇</strong> —
    Google Gemini API + Function Calling(Tool Use) 기반 포트폴리오 질의응답 챗봇.
    "프로젝트 경험이 있나요?", "어떤 기술을 잘 하나요?" 같은 질문에 DB 데이터를 기반으로 답변하고,
    관련 카드를 캐러셀에서 직접 하이라이트합니다.
  </li>
  <li>
    <strong>WYSIWYG 리치 콘텐츠</strong> —
    Tiptap 에디터로 작성한 HTML이 카드 모달 · Resume 상세 페이지에 prose 타이포그래피 스타일로 렌더링됩니다.
    이미지 업로드 시 Supabase Storage에 직접 저장하고 URL을 에디터에 자동 삽입합니다.
    모든 렌더링은 <code>isomorphic-dompurify</code>로 XSS를 방지합니다.
  </li>
  <li>
    <strong>Resume 섹션</strong> —
    경력 · 프로젝트 · 스킬 · 자격증 · 활동 데이터를 Supabase에서 불러와 인쇄 최적화된 레이아웃으로 제공합니다.
  </li>
  <li>
    <strong>Admin 대시보드</strong> —
    인증된 관리자만 접근 가능한 CRUD 대시보드. 쿠키 기반 세션 인증 + Supabase Auth.
    Career · Projects · Cards 항목을 Tiptap WYSIWYG 에디터로 직접 편집합니다.
  </li>
</ul>

<h2>기술적 도전과 해결</h2>
<ul>
  <li>
    <strong>번들 크기 관리</strong> —
    Tiptap은 약 500KB의 무거운 에디터 라이브러리입니다.
    <code>dynamic(() =&gt; import('./TiptapEditorCore'), &#123; ssr: false &#125;)</code> 래퍼 하나로
    Admin 번들에만 포함되도록 격리해 방문자 LCP에 영향을 완전히 제거했습니다.
  </li>
  <li>
    <strong>챗봇 · 캐러셀 스크롤 충돌</strong> —
    캐러셀의 전역 wheel 이벤트 리스너가 챗봇 내부 스크롤을 가로채는 버그.
    이벤트 발원 element에서 부모 방향으로 <code>overflowY: scroll/auto</code>를 순회 탐색해
    스크롤 가능한 컨테이너 안에서 발생한 이벤트는 캐러셀이 처리하지 않도록 수정했습니다.
  </li>
  <li>
    <strong>XSS-safe 위지윅 렌더링</strong> —
    Admin이 작성한 HTML을 방문자에게 그대로 출력하면 XSS 취약점이 생깁니다.
    <code>ALLOWED_TAGS</code> · <code>ALLOWED_ATTR</code> allowlist 기반 <code>sanitizeHtml()</code>을 중앙화하고,
    Resume(서버 컴포넌트)에서는 서버 측 sanitize 후 prop 전달,
    카드 모달(클라이언트 컴포넌트)에서는 <code>useMemo</code>로 캐싱해 재렌더링 비용을 최소화했습니다.
  </li>
  <li>
    <strong>Supabase 인증 계층 분리</strong> —
    쿠키 기반 세션 검증(<code>ANON_KEY</code>)과 Storage 업로드 RLS 우회(<code>SERVICE_ROLE_KEY</code>)를
    별도 클라이언트로 분리해 최소 권한 원칙을 지켰습니다.
  </li>
</ul>

<h2>기술 스택</h2>
<ul>
  <li><strong>Frontend:</strong> Next.js 16.2 (App Router), React 19, TypeScript 5</li>
  <li><strong>Styling:</strong> Tailwind CSS v4, Framer Motion 12, @tailwindcss/typography</li>
  <li><strong>Editor:</strong> Tiptap 3 (StarterKit + Image + Underline extension)</li>
  <li><strong>Backend / DB:</strong> Supabase (PostgreSQL + Storage + Auth)</li>
  <li><strong>AI:</strong> Google Gemini API — Function Calling 기반 Tool Use</li>
  <li><strong>Security:</strong> isomorphic-dompurify (XSS sanitization)</li>
  <li><strong>Deployment:</strong> Vercel (Edge Network)</li>
</ul>
`.trim()
// ──────────────────────────────────────────────────────────────

async function migrate() {
  // 1. 대상 프로젝트 검색
  const { data: projects, error: fetchError } = await supabase
    .from('projects')
    .select('id, title, detail_description')
    .ilike('title', `%${TITLE_KEYWORD}%`)

  if (fetchError) {
    console.error('❌ 프로젝트 조회 실패:', fetchError.message)
    process.exit(1)
  }

  if (!projects || projects.length === 0) {
    console.error(`❌ title에 "${TITLE_KEYWORD}"가 포함된 프로젝트를 찾을 수 없습니다.`)
    console.log('💡 TITLE_KEYWORD를 실제 프로젝트 title 일부로 변경하거나 아래 전체 목록을 확인하세요:')
    const { data: all } = await supabase.from('projects').select('id, title')
    console.table(all)
    process.exit(1)
  }

  if (projects.length > 1) {
    console.log('⚠️  여러 프로젝트가 검색되었습니다. 첫 번째를 대상으로 합니다:')
    console.table(projects.map(p => ({ id: p.id, title: p.title })))
  }

  const target = projects[0]
  console.log(`\n✅ 대상 프로젝트: "${target.title}" (id: ${target.id})`)

  // 2. 업데이트
  const { error: updateError } = await supabase
    .from('projects')
    .update({ detail_description: DETAIL_DESCRIPTION_HTML })
    .eq('id', target.id)

  if (updateError) {
    console.error('❌ 업데이트 실패:', updateError.message)
    process.exit(1)
  }

  console.log('🎉 detail_description 마이그레이션 완료!')
  console.log(`   → /resume/project/${target.id} 에서 확인하세요.`)
}

migrate()
