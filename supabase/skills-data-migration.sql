-- =========================================
-- skills 테이블 기본 시드 데이터
-- resume 페이지 카테고리·숙련도와 정합 (app/resume/page.tsx)
-- Supabase Dashboard → SQL Editor에서 실행
-- =========================================
-- 주의: 기존 skills 행을 모두 지우고 아래 데이터로 덮어씁니다.
-- 일부만 유지하려면 DELETE 구문을 제거하고 INSERT만 선택 실행하세요.

DELETE FROM skills;

INSERT INTO skills (name, category, proficiency, context, display_order) VALUES
-- Frontend
(
  'TypeScript',
  'frontend',
  'expert',
  '타입 안전성·대규모 프론트 코드베이스 유지보수',
  0
),
(
  'React',
  'frontend',
  'expert',
  '컴포넌트 설계, 상태·비동기, 성능 최적화',
  1
),
(
  'Next.js',
  'frontend',
  'expert',
  'App Router, SSR/SSG, API Route, 배포',
  2
),
(
  'HTML / CSS',
  'frontend',
  'advanced',
  '시맨틱 마크업, 반응형·접근성',
  3
),
(
  'Tailwind CSS',
  'frontend',
  'advanced',
  '디자인 시스템·유틸리티 기반 UI',
  4
),
-- Backend
(
  'Node.js',
  'backend',
  'advanced',
  'BFF, 스크립트, 간단한 서버 구성',
  5
),
(
  'REST API',
  'backend',
  'advanced',
  '설계·연동·에러 처리',
  6
),
(
  'PostgreSQL / Supabase',
  'backend',
  'intermediate',
  '스키마 설계, RLS·쿼리',
  7
),
-- DevOps
(
  'Docker',
  'devops',
  'advanced',
  '컨테이너 기반 개발·배포',
  8
),
(
  'CI/CD',
  'devops',
  'advanced',
  '자동 빌드·배포 파이프라인',
  9
),
(
  'AWS',
  'devops',
  'intermediate',
  '클라우드 인프라·MSP 프로젝트 경험',
  10
),
-- Etc
(
  'Git',
  'etc',
  'expert',
  '브랜치 전략, 코드 리뷰, 협업',
  11
),
(
  'Agile / Scrum',
  'etc',
  'advanced',
  '애자일 팀·R&D 협업',
  12
);
