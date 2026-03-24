-- 대내외 활동 일괄 반영 (동일 제목이 있으면 삭제 후 재삽입)
-- Supabase SQL Editor에서 실행하거나: psql -f supabase/migrate-activities-seed.sql

DELETE FROM activities WHERE title IN (
  'Oracle AI Summit 체험 부스 운영',
  'AI x SOFTWAVE 2026 AI 부스 운영',
  '원티드 프리온보딩 프론트엔드 챌린지 6월',
  '원티드 프리온보딩 프론트엔드 챌린지 3월',
  '소프트웨어 교육 과정 이수',
  'AI SW 온라인 코딩입문훈련 교육과정',
  '사물인터넷(IoT)기반 스마트 웹&앱 개발자 과정',
  '안양대학교 정보통신공학과'
);

INSERT INTO activities (title, date, description, blog_url, display_order) VALUES
  (
    'Oracle AI Summit 체험 부스 운영',
    '2026-02-03',
    'Oracle · ITCEN Cloit AI AgentGO 2026 플랫폼 설명 및 체험 부스 운영',
    '',
    0
  ),
  (
    'AI x SOFTWAVE 2026 AI 부스 운영',
    '2025-12-03',
    '소프트웨이브 · 아이티센 AI 플랫폼 Think API 설명 부스 운영',
    '',
    1
  ),
  (
    '원티드 프리온보딩 프론트엔드 챌린지 6월',
    '2024-06-01',
    '2024.06 ~ 2024.06 | 원티드 | React 실전: React Hook과 spa 실전개발',
    '',
    2
  ),
  (
    '원티드 프리온보딩 프론트엔드 챌린지 3월',
    '2024-03-01',
    '2024.03 ~ 2024.04 | 원티드 | React 실전 가이드: 면접 및 실무 기술 프리온보딩 프론트엔드 챌린지',
    '',
    3
  ),
  (
    '소프트웨어 교육 과정 이수',
    '2022-11-02',
    '정보통신산업진흥원 | AI SW 온라인 코딩입문훈련 교육과정 이수증 취득',
    '',
    4
  ),
  (
    'AI SW 온라인 코딩입문훈련 교육과정',
    '2022-08-01',
    '2022.08 ~ 2022.11 | 정보통신산업진흥원 | 핵심 HTML/CSS 기초, 핵심 JavaScript 기초, Node.js와 Express.js, Express.js와 MongoDB, 웹 개발 포트폴리오 만들기 프로젝트',
    '',
    5
  ),
  (
    '사물인터넷(IoT)기반 스마트 웹&앱 개발자 과정',
    '2016-06-01',
    '2016.06 ~ 2017.01 | 한국정보과학진흥협회 | 국비지원 교육 이수 (HTML/CSS, javascript, JAVA - Swing, Hadoop, Android, Arduino)',
    '',
    6
  ),
  (
    '안양대학교 정보통신공학과',
    '2011-03-01',
    '2011.03 ~ 2017.02 | 졸업 (학점: 3.5/4.5)',
    '',
    7
  );
