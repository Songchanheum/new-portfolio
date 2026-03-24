-- 사이드 프로젝트 3개 추가: AI IDE Prototype, AI Agent Coder, TRIGGER 게임
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
  'proj-4',
  'AI IDE Prototype',
  'Google Gemini API로 구동되는 AI 코드 에디터 프로토타입. 로컬 파일 시스템 접근, Monaco 에디터, 코드 변경 Diff 뷰어를 갖춘 AI 채팅 기반 IDE입니다.',
  ARRAY['Next.js', 'TypeScript', 'Monaco Editor', 'Gemini API', 'React 19']::text[],
  '',
  '',
  $d$
<p>브라우저의 FileSystem Access API로 로컬 프로젝트를 열고, Google Gemini와 채팅하며 코드를 수정하는 AI IDE 프로토타입입니다. 변경 사항은 diff-match-patch로 Diff 뷰어에 표시해 수락·거절을 결정할 수 있습니다.</p>
<h4>목적</h4>
<ul>
  <li>브라우저 환경에서 <strong>로컬 파일 시스템 접근</strong>과 AI 코드 편집을 결합한 최소 기능 IDE 검증</li>
  <li>Gemini API의 <strong>코드 생성·수정 능력</strong>을 실제 파일 트리에 연결해 실용성 평가</li>
  <li>변경 사항 검토 후 <strong>선택적 적용(Diff → Accept)</strong> 흐름으로 안전한 AI 협업 UX 설계</li>
</ul>
<h4>주요 구현</h4>
<ul>
  <li><strong>FileSystem Access API</strong>로 디렉터리 탐색·파일 읽기·쓰기를 구현하고, IndexedDB(idb-keyval)로 최근 프로젝트 경로 유지</li>
  <li><strong>Monaco Editor</strong>로 다중 언어 구문 강조 코드 뷰어를 제공하고, 선택 범위를 AI 컨텍스트로 전달</li>
  <li><strong>Gemini API</strong> 스트리밍 응답을 채팅 UI에 연결하고, 코드 블록을 파싱해 diff-match-patch로 원본과 비교</li>
  <li>변경 사항 리뷰 모달에서 Diff 시각화 후 <strong>파일별 수락·거절</strong> 처리</li>
</ul>
<h4>성과</h4>
<ul>
  <li>설치 없이 브라우저에서 <strong>로컬 코드베이스에 AI 편집</strong>을 적용하는 PoC 완성</li>
  <li>Diff 뷰어 + 수락 흐름으로 AI 제안의 <strong>과도한 덮어쓰기 방지</strong> UX 확립</li>
</ul>
<h4>개선점</h4>
<ul>
  <li>대용량 파일 처리 및 <strong>컨텍스트 창 초과</strong> 시 청크 분할 전략 필요</li>
  <li>멀티 파일 동시 편집 및 <strong>undo/redo 히스토리</strong> 통합</li>
</ul>
$d$,
  '1인 개발',
  '2025',
  '',
  4
),
(
  'proj-5',
  'AI Agent Coder',
  '자연어로 AI 에이전트를 설계·생성하고, ADK 오케스트레이션과 Vercel Sandbox 위에서 즉석 테스트할 수 있는 에이전트 빌더 앱. 멀티턴 챗봇으로 만든 에이전트와 바로 대화할 수 있습니다.',
  ARRAY['Next.js', 'TypeScript', 'Gemini API', 'Agent Development Kit', 'Vercel Sandbox', 'Tailwind CSS']::text[],
  '',
  '',
  $d$
<p>"어떤 에이전트가 필요한지 설명하면, 그 에이전트가 바로 만들어진다." — 자연어 명세를 입력하면 ADK 기반 에이전트 코드를 생성하고, Vercel Sandbox에서 즉시 실행해 멀티턴 챗봇으로 테스트할 수 있는 에이전트 빌더 앱입니다.</p>
<h4>목적</h4>
<ul>
  <li>에이전트 개발의 <strong>설계→코드 생성→실행→대화 테스트</strong> 사이클을 단일 UI에서 완결</li>
  <li>ADK(Agent Development Kit)의 오케스트레이션 레이어를 활용해 <strong>멀티 에이전트 구성</strong>을 코드 없이 시험할 수 있는 환경 제공</li>
  <li>Vercel Sandbox로 생성된 에이전트를 <strong>격리 실행</strong>해 사이드이펙트 없이 동작을 검증</li>
</ul>
<h4>주요 구현</h4>
<ul>
  <li><strong>자연어 → 에이전트 명세 변환</strong> — 사용자가 입력한 역할·툴·제약 조건을 Gemini API로 파싱해 ADK 에이전트 코드(툴 정의, 프롬프트, 오케스트레이션 설정) 자동 생성</li>
  <li><strong>ADK 오케스트레이션</strong> — 단일 에이전트부터 루터·워커 구조의 멀티 에이전트까지 구성 가능하며, 에이전트 간 메시지 흐름을 시각적으로 확인</li>
  <li><strong>Vercel Sandbox</strong>로 생성된 에이전트 코드를 격리 환경에서 구동하고, 실행 로그를 스트리밍으로 UI에 반영</li>
  <li><strong>멀티턴 챗봇 테스트 패널</strong> — 생성 즉시 에이전트와 대화해 응답 품질·툴 호출 흐름을 확인하고, 명세를 수정·재생성하는 이터레이션 루프 지원</li>
</ul>
<h4>성과</h4>
<ul>
  <li>에이전트 아이디어에서 <strong>첫 동작 확인까지</strong> 코드 작성 없이 수 분 내 가능</li>
  <li>Sandbox 격리로 미완성 에이전트의 <strong>의도치 않은 외부 호출</strong>을 차단하며 안전한 실험 환경 확보</li>
</ul>
<h4>개선점</h4>
<ul>
  <li>생성된 에이전트 코드의 <strong>버전 관리·스냅샷 저장</strong>으로 이터레이션 히스토리 추적</li>
  <li>ADK 오케스트레이션 시각화 고도화 — <strong>에이전트 간 메시지 흐름·툴 호출 그래프</strong> 인터랙티브 뷰</li>
</ul>
$d$,
  '1인 개발',
  '2025',
  '',
  5
),
(
  'proj-6',
  'TRIGGER — 카카오톡 총기 강화 게임',
  '카카오톡 챗봇으로 즐기는 텍스트 기반 총기 강화 RPG. 5개 분류 25종 총기를 +20까지 강화하고, PvP 배틀·랭킹·출석 보상을 갖춘 Python Flask 서버리스 게임입니다.',
  ARRAY['Python', 'Flask', 'Redis', 'Vercel', 'Kakao Chatbot API']::text[],
  '',
  '',
  $d$
<p>카카오톡 메시지만으로 총기를 수집·강화하고 다른 플레이어와 배틀하는 텍스트 RPG입니다. 카카오 챗봇 빌더 Webhook을 Flask 서버리스 함수로 받아 처리하고, Redis로 플레이어 데이터를 관리합니다.</p>
<h4>목적</h4>
<ul>
  <li>별도 앱 설치 없이 <strong>카카오톡 안에서</strong> 즐길 수 있는 캐주얼 게임 구현</li>
  <li>확률 기반 강화·수리 시스템으로 <strong>반복 플레이 동기</strong>를 만들고, 랭킹으로 경쟁 요소 부여</li>
  <li>서버리스(Vercel) + Redis로 <strong>인프라 비용 최소화</strong>하며 실시간 상태 유지</li>
</ul>
<h4>주요 구현</h4>
<ul>
  <li><strong>카카오 챗봇 빌더 Webhook</strong>을 Flask로 수신하고, 명령어 파싱 → 게임 로직 → JSON 응답 구조로 처리</li>
  <li>5개 분류(권총·SMG·소총·저격·특수) × 5단계 이미지로 <strong>25종 총기 시각화</strong>, 강화 레벨에 따라 이미지 URL 동적 서빙</li>
  <li><strong>확률 스케일링 강화 시스템</strong> — 레벨이 높아질수록 성공률 하락, 실패 시 파괴·수리(40% 성공/60% 완전 파괴) 메카닉</li>
  <li>Redis로 플레이어 데이터·잠금(중복 요청 방지)·랭킹 Sorted Set 관리, <strong>출석 보상·PvP 데미지 계산</strong> 포함</li>
</ul>
<h4>성과</h4>
<ul>
  <li>카카오톡 메시지만으로 <strong>완결된 게임 루프</strong>(수집→강화→배틀→랭킹) 구현</li>
  <li>Redis 잠금으로 <strong>중복 요청·레이스 컨디션</strong> 방지해 데이터 정합성 확보</li>
</ul>
<h4>개선점</h4>
<ul>
  <li>강화 확률·밸런스 튜닝을 위한 <strong>게임 데이터 분석 파이프라인</strong> 구축</li>
  <li>길드·채팅방 단위 <strong>팀 배틀·이벤트 시스템</strong> 확장</li>
</ul>
$d$,
  '1인 개발',
  '2024',
  '',
  6
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
