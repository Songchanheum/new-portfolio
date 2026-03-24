-- proj-5 (AI Agent Coder) 내용 고도화 업데이트
-- Supabase SQL Editor에서 실행

UPDATE projects SET
  title = 'AI Agent Coder',
  description = '자연어로 AI 에이전트를 설계·생성하고, ADK 오케스트레이션과 Vercel Sandbox 위에서 즉석 테스트할 수 있는 에이전트 빌더 앱. 멀티턴 챗봇으로 만든 에이전트와 바로 대화할 수 있습니다.',
  tech_stack = ARRAY['Next.js', 'TypeScript', 'Gemini API', 'Agent Development Kit', 'Vercel Sandbox', 'Tailwind CSS']::text[],
  detail_description = $d$
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
  <li>에이전트 생성 품질의 핵심인 <strong>시스템 프롬프트 고도화</strong> — 역할·툴·제약을 더 정밀하게 추출하고, 엣지 케이스·예외 처리까지 명세에 반영되도록 프롬프트 구조 개선 필요</li>
  <li>생성된 에이전트 코드의 <strong>버전 관리·스냅샷 저장</strong>으로 이터레이션 히스토리 추적</li>
  <li>ADK 오케스트레이션 시각화 고도화 — <strong>에이전트 간 메시지 흐름·툴 호출 그래프</strong> 인터랙티브 뷰</li>
</ul>
$d$,
  updated_at = NOW()
WHERE id = 'proj-5';
