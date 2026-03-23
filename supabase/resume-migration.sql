-- =========================================
-- Resume 페이지 DB 마이그레이션
-- Supabase Dashboard → SQL Editor에서 실행
-- =========================================

-- ─────────────────────────────────────────
-- 1. 기존 테이블 확장 (career)
-- ─────────────────────────────────────────
ALTER TABLE career ADD COLUMN IF NOT EXISTS detail_description TEXT NOT NULL DEFAULT '';
ALTER TABLE career ADD COLUMN IF NOT EXISTS achievements TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE career ADD COLUMN IF NOT EXISTS career_tech_stack TEXT[] NOT NULL DEFAULT '{}';

-- ─────────────────────────────────────────
-- 2. 기존 테이블 확장 (projects)
-- ─────────────────────────────────────────
ALTER TABLE projects ADD COLUMN IF NOT EXISTS detail_description TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS period TEXT NOT NULL DEFAULT '';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS contributions TEXT NOT NULL DEFAULT '';

-- ─────────────────────────────────────────
-- 3. 신규 테이블: skills
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',   -- 'frontend' | 'backend' | 'devops' | 'etc'
  proficiency TEXT NOT NULL DEFAULT '', -- 'expert' | 'advanced' | 'intermediate'
  context TEXT NOT NULL DEFAULT '',    -- 경험 맥락 (예: "Next.js — 3개 프로젝트 메인 개발")
  display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write skills" ON skills FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- 4. 신규 테이블: certifications
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  issued_by TEXT NOT NULL DEFAULT '',
  issued_at DATE,
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read certifications" ON certifications FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- 5. 신규 테이블: activities
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE,
  description TEXT NOT NULL DEFAULT '',
  blog_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read activities" ON activities FOR SELECT USING (true);
CREATE POLICY "Allow authenticated write activities" ON activities FOR ALL USING (auth.role() = 'authenticated');
