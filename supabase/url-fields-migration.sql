-- career 테이블: 회사 홈페이지 URL 추가
ALTER TABLE career ADD COLUMN IF NOT EXISTS company_url TEXT NOT NULL DEFAULT '';

-- projects 테이블: 프로젝트 상세 URL 추가
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_url TEXT NOT NULL DEFAULT '';
