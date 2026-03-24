-- 카드 테이블
CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('intro', 'developer', 'career', 'projects', 'topic')),
  keyword TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 경력 테이블
CREATE TABLE IF NOT EXISTS career (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- 프로젝트 테이블
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  thumbnail_url TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0
);

-- RLS 활성화
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE career ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- 읽기 전용 정책 (anon 키로 조회 허용)
CREATE POLICY "Allow public read cards" ON cards FOR SELECT USING (true);
CREATE POLICY "Allow public read career" ON career FOR SELECT USING (true);
CREATE POLICY "Allow public read projects" ON projects FOR SELECT USING (true);

-- 카드 초기 데이터
INSERT INTO cards (id, type, keyword, detail, display_order) VALUES
  ('card-0', 'intro', 'AI를 탐구하고, 전 영역을 넘나들며, 공백을 채우는 개발자', '프론트엔드부터 백엔드, 인프라까지 — 필요한 곳이면 어디든 뛰어들었습니다. AI를 단순한 도구가 아니라 사고의 확장으로 활용하며, 팀에서 비어 있는 역할을 스스로 찾아 채웁니다.', 0),
  ('card-1', 'developer', '기술이 인간에게 어떻게 느껴져야 하는가를 설계합니다', '좋은 기술은 사용자가 의식하지 못할 때 완성됩니다. 인터페이스의 무게, 반응의 속도, 전환의 리듬 — 눈에 보이지 않는 디테일이 경험을 결정합니다.', 1),
  ('card-2', 'career', '디자이너 없이도 방향을 잡고, 기획자 없이도 결정을 내렸던 순간들', '클릭하면 경력 타임라인을 볼 수 있습니다. 스타트업부터 엔터프라이즈까지, 기획·디자인·개발을 넘나들며 빈자리를 채워온 여정입니다.', 2),
  ('card-3', 'projects', 'AI와 함께 만든 것들 — 코드보다 경험을 먼저 설계했습니다', '클릭하면 사이드 프로젝트들을 탐험할 수 있습니다. AI와 함께 아이디어를 프로토타이핑하고, 경험부터 역순으로 설계한 프로젝트들입니다.', 3),
  ('card-4', 'topic', 'AI 가치와 사용자 경험에 대한 기술적 지향점', $topic$
<p><strong>AI는 도구가 아니라 협업자입니다.</strong> 기술이 인간에게 어떻게 느껴져야 하는지를 설계하고, 경계를 넘나들며 실행하는 개발자로서의 철학을 공유합니다.</p>

<hr />

<section>
  <h2>1. 도구를 넘어선 협업자로서의 AI</h2>
  <p>AI가 단순히 명령을 수행하는 도구에 머무는 한, 진짜 가치는 드러나지 않습니다. <strong>AI와 함께 사고하고, 함께 만들고, 그 과정 자체를 사용자에게 체감시키는 것</strong>이 저의 목표입니다.</p>
  <ul>
    <li><strong>상호작용의 재설계:</strong> 일방향적 지시가 아닌 피드백이 오가는 파트너십 구축</li>
    <li><strong>가치의 구체화:</strong> 결과물뿐만 아니라 결과에 도달하는 논리적 과정의 시각화</li>
  </ul>
</section>

<section>
  <h2>2. 무의식적 몰입을 돕는 경험 설계</h2>
  <p>좋은 기술은 사용자가 기술의 존재를 의식하지 못할 때 완성됩니다. <strong>인터페이스의 무게, 반응의 속도, 전환의 리듬</strong> — 눈에 보이지 않는 디테일이 사용자의 전체 경험을 결정합니다.</p>
  <ul>
    <li><strong>인터페이스의 무게:</strong> 사용자가 느끼는 심리적 부담의 최소화</li>
    <li><strong>반응의 속도:</strong> 사고의 흐름이 끊기지 않는 즉각적인 피드백</li>
    <li><strong>전환의 리듬:</strong> 기능과 기능 사이의 매끄러운 연결성</li>
  </ul>
</section>

<section>
  <h2>3. 전 영역을 넘나들며 공백을 채우는 개발자</h2>
  <p>프론트엔드부터 백엔드, 인프라까지 필요한 곳이면 어디든 뛰어듭니다. <strong>AI를 단순한 도구가 아니라 사고의 확장으로 활용</strong>하며, 팀 내에서 비어 있는 역할을 스스로 찾아 채웁니다.</p>
  <table>
    <thead>
      <tr>
        <th>분류</th>
        <th>역량 및 지향점</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>기술적 범위</strong></td>
        <td>프론트엔드, 백엔드, 인프라 전 영역을 아우르는 실행력</td>
      </tr>
      <tr>
        <td><strong>AI 활용 능력</strong></td>
        <td>단순 구현을 넘어 문제 해결을 위한 사고의 확장판으로 활용</td>
      </tr>
      <tr>
        <td><strong>팀 내 역할</strong></td>
        <td>프로젝트의 성공을 위해 필요한 지점을 선제적으로 파악 및 해결</td>
      </tr>
    </tbody>
  </table>
</section>
$topic$, 4)
ON CONFLICT (id) DO NOTHING;

-- 경력 초기 데이터
INSERT INTO career (id, company, role, period, description, display_order) VALUES
  ('career-0', '프리랜서 / 1인 개발', '풀스택 개발자', '2024.01 — 현재', 'AI를 활용한 프로토타이핑과 사이드 프로젝트를 주도. 기획부터 디자인, 개발, 배포까지 전 과정을 1인으로 수행하며 경험 중심의 제품 설계 역량을 강화.', 0),
  ('career-1', '스타트업 A', '프론트엔드 리드', '2022.03 — 2023.12', '디자이너 없이 UI/UX를 직접 설계하고, 기획자 없이 제품 방향을 결정. React + TypeScript 기반 SPA를 구축하고 팀의 기술적 의사결정을 리드.', 1),
  ('career-2', '스타트업 B', '풀스택 개발자', '2020.06 — 2022.02', '백엔드 API 설계부터 프론트엔드 구현, 인프라 구축까지 전 영역을 담당. 빈자리를 스스로 찾아 채우며 팀의 기술 부채를 줄이는 데 집중.', 2),
  ('career-3', '엔터프라이즈 C', '주니어 개발자', '2018.09 — 2020.05', '대규모 레거시 시스템의 현대화 프로젝트에 참여. Java/Spring 기반 백엔드와 jQuery → React 마이그레이션을 경험하며 엔터프라이즈 개발의 기초를 다짐.', 3)
ON CONFLICT (id) DO NOTHING;

-- 프로젝트 초기 데이터
INSERT INTO projects (id, title, description, tech_stack, thumbnail_url, display_order) VALUES
  ('proj-0', 'AI 포트폴리오', '이 사이트 자체가 프로젝트입니다. CSS 3D 캐러셀, 커서 반응 조명, AI 챗봇까지 — 경험을 먼저 설계하고 기술을 입힌 인터랙티브 포트폴리오.', ARRAY['Next.js', 'Framer Motion', 'Supabase', 'Gemini'], '', 0),
  ('proj-1', '블로그 페이지 리팩토링', 'Markdown 기반 블로그를 Notion을 단일 소스로 두는 구조로 옮기고, Next.js 14와 Notion API·React Query로 조회·캐시 전략을 정리한 리팩토링입니다.', ARRAY['Next.js 14', 'React Query', 'Tailwind CSS', 'Notion API', 'TypeScript'], '', 1),
  ('proj-2', 'Daily Dev (Instagram Clone Coding)', '매일 읽은 개발 블로그·문서·게시글을 한곳에 모아 Instagram 피드에 가깝게 탐색하는 북마크형 웹앱입니다. 포트폴리오 도메인 root를 활용했습니다.', ARRAY['Next.js 14', 'React Query', 'Tailwind CSS', 'PWA', 'TypeScript'], '', 2),
  ('proj-3', '포트폴리오 페이지 개발', '프로필·작업물·이력을 한 사이트에 담고, 인터랙션과 인쇄용 이력서까지 고려한 개인 포트폴리오입니다. App Router layout으로 /resume과 /main을 분리했습니다.', ARRAY['Next.js 13', 'React Query', 'Tailwind CSS', 'Framer Motion', 'TypeScript'], '', 3)
ON CONFLICT (id) DO NOTHING;
