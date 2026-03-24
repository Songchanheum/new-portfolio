-- 프로젝트 proj-1 ~ proj-3 내용 갱신 (신규 삽입 + 기존 행 업데이트)
-- display_order 0(proj-0)은 건드리지 않음.
-- project_url을 이미 넣었다면, 스크립트의 빈 문자열로 덮어쓰지 않고 기존 값 유지.
-- Supabase SQL Editor에서 실행

INSERT INTO projects (
  id,
  title,
  description,
  tech_stack,
  thumbnail_url,
  project_url,
  detail_description,
  role,
  period,
  contributions,
  display_order
)
VALUES
(
  'proj-1',
  '블로그 페이지 리팩토링',
  'Markdown 기반 블로그를 Notion을 단일 소스로 두는 구조로 옮기고, Next.js 14와 Notion API·React Query로 조회·캐시 전략을 정리한 리팩토링입니다.',
  ARRAY['Next.js 14', 'React Query', 'Tailwind CSS', 'Notion API', 'TypeScript']::text[],
  '',
  '',
  $d$
<p>게시글 작성·수정 워크플로를 Notion으로 통일하고, 웹에서는 API로만 읽어 오도록 경계를 나눴습니다. 기존 글의 메타데이터·본문 구조를 유지한 채 이전해 검색·태그·목차 등 콘텐츠 운영 부담을 줄였습니다.</p>
<h4>목적</h4>
<ul>
  <li>편집은 익숙한 Notion에 두고, 공개 블로그는 <strong>읽기 전용·배포 파이프 단순화</strong>를 목표로 함</li>
  <li>Markdown 파일 분산·수동 동기화를 없애고 <strong>단일 소스 오브 트루스</strong>로 운영 비용을 낮춤</li>
  <li>Notion API rate limit·지연을 전제로 <strong>프론트 캐시 전략</strong>을 명확히 하여 사용자 체감 속도를 안정화</li>
</ul>
<h4>주요 구현</h4>
<ul>
  <li>로컬·저장소에 흩어져 있던 <strong>Markdown 파일을 Notion 데이터베이스로 마이그레이션</strong>하고, 블록·속성 매핑 규칙을 정해 재현 가능하게 정리</li>
  <li><strong>Notion API</strong>로 페이지·블록을 조회하고, 공개용 뷰에 맞게 필터·정렬·페이지네이션 설계</li>
  <li><strong>React Query(TanStack Query)</strong>로 서버 상태 캐시·staleTime·재검증 정책을 두어 목록·상세 간 이동 시 불필요한 호출 감소</li>
  <li>App Router 환경에서 로딩·에러 경계를 나누고, Tailwind로 타이포·다크/라이트 등 읽기 경험을 맞춤</li>
</ul>
<h4>성과</h4>
<ul>
  <li>콘텐츠 수정이 코드 배포와 분리되어 <strong>비개발자도 글 갱신</strong>이 가능한 구조에 가까워짐</li>
  <li>목록·상세 왕복 시 중복 API 호출을 줄여 <strong>체감 로딩과 API 사용량</strong>을 동시에 완화</li>
  <li>블록 타입별 렌더링 규칙을 문서화해 <strong>추가 글·섹션 확장</strong> 시 혼선 감소</li>
</ul>
<h4>개선점</h4>
<ul>
  <li>Notion 장애·지연 시 <strong>폴백(정적 캐시·ISR)</strong>을 두어 가용성을 높이는 방안 검토</li>
  <li>대량 글·이미지가 늘 경우 <strong>이미지 최적화·CDN·프리패치</strong> 정책 보강</li>
  <li>검색·태그 UX를 강화하고, 필요 시 <strong>Algolia 등 외부 검색</strong>과의 연동 여지 확보</li>
</ul>
$d$,
  '1인 개발',
  '2024',
  '',
  1
),
(
  'proj-2',
  'Daily Dev (Instagram Clone Coding)',
  '매일 읽은 개발 블로그·문서·게시글을 한곳에 모아 두고, Instagram 피드에 가깝게 탐색하는 북마크형 웹앱입니다. 포트폴리오 도메인 root를 활용해 배포·진입 경로를 단순화했습니다.',
  ARRAY['Next.js 14', 'React Query', 'Tailwind CSS', 'PWA', 'TypeScript']::text[],
  '',
  '',
  $d$
<p>“오늘 본 글을 빠르게 남기고, 나중에 모바일에서도 습관처럼 열어본다”는 사용 시나리오를 기준으로 UI를 잡았습니다. 카드·스크롤·하단 내비 등 인스타그램 사용 패턴을 참고해 학습 곡선을 낮췄습니다.</p>
<h4>목적</h4>
<ul>
  <li>흩어진 북마크·탭 대신 <strong>하나의 피드</strong>에서 읽은 자료를 모아 복습·공유하기 쉽게 함</li>
  <li>모바일 사용 비중을 고려해 <strong>PWA·터치 우선 UI</strong>로 접근 빈도와 잔존율을 높임</li>
  <li>포트폴리오와 같은 도메인에 두어 <strong>배포·인증·도메인 비용</strong>을 한 번에 관리</li>
</ul>
<h4>주요 구현</h4>
<ul>
  <li>동일 리포지토리·도메인에서 <strong>포트폴리오와 공존</strong>하도록 root path·라우팅을 설계해 배포·SSL·환경 변수 관리 포인트를 줄임</li>
  <li><strong>Instagram 클론 코딩</strong>을 바탕으로 피드 레이아웃, 썸네일 비율, 스크롤 성능을 맞추고 컴포넌트 단위로 재사용</li>
  <li><strong>PWA</strong>(manifest, service worker)로 홈 화면 추가·오프라인 캐시 등 앱에 가까운 설치·실행 경험 제공</li>
  <li>React Query로 북마크·태그·필터 상태를 서버 데이터와 동기화하고, 낙관적 업데이트로 입력 반응 속도 개선</li>
</ul>
<h4>성과</h4>
<ul>
  <li>익숙한 피드 패턴으로 <strong>입력·조회까지의 단계 수</strong>를 줄이고 일일 기록 습관 형성에 유리</li>
  <li>PWA로 <strong>앱 설치 없이 홈 화면 진입</strong>이 가능해 모바일 재방문 장벽 완화</li>
  <li>포트폴리오와 코드베이스 공유로 <strong>유지보수 단일화</strong> — 기능 추가 시 중복 인프라 최소화</li>
</ul>
<h4>개선점</h4>
<ul>
  <li>썸네일·OG 미리보기 <strong>자동 수집 실패 시 수동 보정</strong> UX 및 큐·재시도 정책</li>
  <li>태그·검색·정렬 고도화, <strong>읽음 처리·알림(웹 푸시)</strong> 등 습관 형성 기능 확장</li>
  <li>Service Worker 캐시 전략을 세분화해 <strong>스토리지 한도·무효화</strong> 이슈 대비</li>
</ul>
$d$,
  '1인 개발',
  '2024',
  '',
  2
),
(
  'proj-3',
  '포트폴리오 페이지 개발',
  '프로필·작업물·이력을 한 사이트에 담고, 인터랙션과 인쇄용 이력서까지 고려한 개인 포트폴리오입니다. App Router의 layout으로 화면 성격이 다른 구역을 나눴습니다.',
  ARRAY['Next.js 13', 'React Query', 'Tailwind CSS', 'Framer Motion', 'TypeScript']::text[],
  '',
  '',
  $d$
<p>방문자가 첫 화면에서 시각적 인상을 받고, 곧바로 이력·프로젝트로 이어지도록 정보 구조와 모션을 같이 설계했습니다. 제출용 PDF·인쇄 시 레이아웃이 깨지지 않도록 별도 라우트와 스타일을 두었습니다.</p>
<h4>목적</h4>
<ul>
  <li>한 URL에서 <strong>브랜드(포트폴리오)</strong>와 <strong>실무 증빙(이력서)</strong>을 동시에 전달해 지원·네트워킹 시 맥락 전환 비용을 줄임</li>
  <li>인쇄·PDF 제출이 잦은 국내 채용 환경에 맞춰 <strong>이력서 가독성·페이지 분할</strong>을 우선 과제로 둠</li>
  <li>시각적 차별화와 정보 탐색성의 균형 — <strong>과한 모션 없이도 기억에 남는 첫인상</strong>을 목표로 함</li>
</ul>
<h4>주요 구현</h4>
<ul>
  <li><strong>Parallax·스크롤 연동</strong>으로 섹션 전환과 시선 흐름을 조절하고, Framer Motion으로 진입·호버 등 마이크로 인터랙션 정리</li>
  <li>브랜드 톤에 맞는 타이포·여백·그리드로 <strong>인터랙티브 웹 디자인</strong> 방향을 통일하고, 반응형 브레이크포인트별 우선순위 조정</li>
  <li><strong>간편 제출용 이력서 페이지</strong> — 인쇄 미리보기·PDF 저장에 맞춘 여백, 페이지 나눔, 불필요한 UI 숨김(<code>@media print</code> 등)</li>
  <li><strong>App Router layout</strong>으로 <code>/resume</code>(이력서·경력 상세 톤)과 <code>/main</code>(포트폴리오 메인 톤) 등 path별 레이아웃·내비·메타를 분리</li>
  <li>React Query로 외부·CMS성 데이터가 늘어날 경우를 대비해 클라이언트 캐시 패턴을 초기부터 맞춤</li>
</ul>
<h4>성과</h4>
<ul>
  <li>이력서와 포트폴리오를 <strong>같은 브랜드 톤</strong>으로 맞춰 제출물 간 이질감 감소</li>
  <li>인쇄 전용 스타일 분리로 <strong>브라우저 인쇄·PDF 저장 시 레이아웃 붕괴</strong>를 최소화</li>
  <li>layout 분리로 경력 상세·프로젝트 상세 등 <strong>콘텐츠가 늘어도 라우팅·메타 관리</strong>가 단순해짐</li>
</ul>
<h4>개선점</h4>
<ul>
  <li>다국어·접근성(키보드 포커스, 스크린리더) <strong>WCAG 기준 점검</strong> 및 대비·라벨 보강</li>
  <li>이력서 <strong>자동 PDF 생성(서버·헤드리스)</strong> 파이프라인으로 브라우저별 인쇄 차이 완화</li>
  <li>Lighthouse·Core Web Vitals 기준 <strong>이미지·폰트·모션 비용</strong> 지속 튜닝</li>
</ul>
<p>배포 URL·GitHub 저장소는 <code>UPDATE projects SET project_url = '…' WHERE id = 'proj-3'</code> 등으로 연결하면 됩니다.</p>
$d$,
  '1인 개발',
  '2023',
  '',
  3
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  tech_stack = EXCLUDED.tech_stack,
  thumbnail_url = EXCLUDED.thumbnail_url,
  project_url = COALESCE(NULLIF(EXCLUDED.project_url, ''), projects.project_url),
  detail_description = EXCLUDED.detail_description,
  role = EXCLUDED.role,
  period = EXCLUDED.period,
  contributions = EXCLUDED.contributions,
  display_order = EXCLUDED.display_order,
  updated_at = NOW();
