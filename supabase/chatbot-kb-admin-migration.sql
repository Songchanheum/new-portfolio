-- ============================================================
-- Story 2.1: chatbot_kb 테이블 마이그레이션
-- status 컬럼: 청크 처리 상태 추적
-- source_file 컬럼: 업로드 파일 역추적 + 일괄 삭제
-- Supabase Dashboard → SQL Editor에서 실행
-- ============================================================

-- 1. status 컬럼 추가 (기존 레코드는 completed로 간주)
ALTER TABLE chatbot_kb
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'completed';

-- 2. source_file 컬럼 추가 (nullable — 기존 레코드는 NULL 허용)
ALTER TABLE chatbot_kb
  ADD COLUMN IF NOT EXISTS source_file TEXT;

-- 3. status CHECK 제약조건 추가 (DO $$ 블록으로 중복 실행 안전)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'chatbot_kb_status_check'
      AND table_name = 'chatbot_kb'
  ) THEN
    ALTER TABLE chatbot_kb
      ADD CONSTRAINT chatbot_kb_status_check
      CHECK (status IN ('pending', 'processing', 'completed', 'failed'));
  END IF;
END $$;

-- 4. status 컬럼 인덱스 (처리 상태별 필터링 성능)
CREATE INDEX IF NOT EXISTS idx_chatbot_kb_status
  ON chatbot_kb(status);

-- 5. source_file 컬럼 인덱스 (파일 기준 일괄 조회/삭제 성능)
CREATE INDEX IF NOT EXISTS idx_chatbot_kb_source_file
  ON chatbot_kb(source_file);

-- 검증 쿼리 (실행 후 결과 확인용)
-- SELECT column_name, data_type, column_default, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'chatbot_kb'
--   AND column_name IN ('status', 'source_file')
-- ORDER BY column_name;
