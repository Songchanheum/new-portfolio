-- pgvector 확장 활성화
create extension if not exists vector;

-- chatbot_kb 테이블 생성
create table if not exists chatbot_kb (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(768),
  metadata jsonb,
  created_at timestamptz default now()
);

-- 유사도 검색 인덱스
create index if not exists chatbot_kb_embedding_idx
  on chatbot_kb using ivfflat (embedding vector_cosine_ops);

-- 유사도 검색 RPC 함수
create or replace function match_documents(
  query_embedding vector(768),
  match_threshold float,
  match_count int
) returns table (id uuid, content text, similarity float)
language plpgsql as $$
begin
  return query
  select chatbot_kb.id, chatbot_kb.content,
    1 - (chatbot_kb.embedding <=> query_embedding) as similarity
  from chatbot_kb
  where 1 - (chatbot_kb.embedding <=> query_embedding) > match_threshold
  order by chatbot_kb.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- RLS 정책
alter table chatbot_kb enable row level security;
create policy "chatbot_kb_read" on chatbot_kb for select using (true);

-- 시드 데이터 (텍스트만, 임베딩은 스크립트로 생성)
insert into chatbot_kb (content, metadata) values
(
  '송찬흠은 풀스택 개발자로, 프론트엔드부터 백엔드, 인프라까지 필요한 곳이면 어디든 뛰어드는 개발자입니다. AI를 단순한 도구가 아니라 사고의 확장으로 활용하며, 팀에서 비어 있는 역할을 스스로 찾아 채웁니다.',
  '{"category": "intro"}'
),
(
  '2024년 1월부터 현재까지 프리랜서/1인 개발자로 활동 중입니다. AI를 활용한 프로토타이핑과 사이드 프로젝트를 주도하며, 기획부터 디자인, 개발, 배포까지 전 과정을 1인으로 수행하고 있습니다.',
  '{"category": "career", "company": "프리랜서"}'
),
(
  '2022년 3월부터 2023년 12월까지 스타트업 A에서 프론트엔드 리드로 근무했습니다. 디자이너 없이 UI/UX를 직접 설계하고, 기획자 없이 제품 방향을 결정했습니다. React + TypeScript 기반 SPA를 구축하고 팀의 기술적 의사결정을 리드했습니다.',
  '{"category": "career", "company": "스타트업 A"}'
),
(
  '2020년 6월부터 2022년 2월까지 스타트업 B에서 풀스택 개발자로 근무했습니다. 백엔드 API 설계부터 프론트엔드 구현, 인프라 구축까지 전 영역을 담당했습니다.',
  '{"category": "career", "company": "스타트업 B"}'
),
(
  '2018년 9월부터 2020년 5월까지 엔터프라이즈 C에서 주니어 개발자로 근무했습니다. 대규모 레거시 시스템의 현대화 프로젝트에 참여하여 Java/Spring 기반 백엔드와 jQuery에서 React로의 마이그레이션을 경험했습니다.',
  '{"category": "career", "company": "엔터프라이즈 C"}'
),
(
  '사이드 프로젝트: AI 포트폴리오 — 이 사이트 자체가 프로젝트입니다. CSS 3D 캐러셀, 커서 반응 조명, AI 챗봇까지 경험을 먼저 설계하고 기술을 입힌 인터랙티브 포트폴리오. 기술스택: Next.js, Framer Motion, Supabase, Gemini.',
  '{"category": "project", "title": "AI 포트폴리오"}'
),
(
  '사이드 프로젝트: AI 코드 리뷰어 — PR이 올라오면 자동으로 코드를 분석하고 리뷰 코멘트를 남기는 GitHub Action. 컨텍스트를 이해하는 리뷰를 목표로 설계. 기술스택: TypeScript, GitHub Actions, Claude API.',
  '{"category": "project", "title": "AI 코드 리뷰어"}'
),
(
  '사이드 프로젝트: 실시간 협업 에디터 — WebSocket 기반의 실시간 마크다운 협업 에디터. CRDT 알고리즘으로 충돌 없는 동시 편집을 구현. 기술스택: React, WebSocket, Y.js, Node.js.',
  '{"category": "project", "title": "실시간 협업 에디터"}'
),
(
  '사이드 프로젝트: 개인 지식 관리 시스템 — 읽은 글, 메모, 아이디어를 벡터 임베딩으로 연결하는 PKM 도구. 관련 노트를 자동으로 추천. 기술스택: Next.js, Supabase, pgvector, OpenAI.',
  '{"category": "project", "title": "개인 지식 관리 시스템"}'
),
(
  '송찬흠의 기술 스택: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Node.js, Java/Spring, Supabase, PostgreSQL, pgvector, WebSocket, GitHub Actions, Vercel, Docker. AI 도구: Google Gemini, Claude API, OpenAI API.',
  '{"category": "skills"}'
),
(
  '송찬흠의 개발 철학: 기술이 인간에게 어떻게 느껴져야 하는가를 설계합니다. AI는 도구가 아니라 협업자라고 생각하며, 코드보다 경험을 먼저 설계하는 접근을 추구합니다. 디자이너 없이도 방향을 잡고, 기획자 없이도 결정을 내릴 수 있는 자율적인 개발자입니다.',
  '{"category": "philosophy"}'
);
