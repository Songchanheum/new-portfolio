-- =========================================
-- Admin 기능용 updated_at 컬럼 추가 마이그레이션
-- Supabase Dashboard → SQL Editor에서 실행
-- =========================================

-- cards 테이블
ALTER TABLE cards ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- career 테이블
ALTER TABLE career ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- projects 테이블
ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 자동 updated_at 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- cards 트리거
DROP TRIGGER IF EXISTS update_cards_updated_at ON cards;
CREATE TRIGGER update_cards_updated_at
  BEFORE UPDATE ON cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- career 트리거
DROP TRIGGER IF EXISTS update_career_updated_at ON career;
CREATE TRIGGER update_career_updated_at
  BEFORE UPDATE ON career
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- projects 트리거
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
