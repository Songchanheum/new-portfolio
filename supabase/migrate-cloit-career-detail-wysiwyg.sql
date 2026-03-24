-- (주)아이티센클로잇 경력 상세 — 위지윅 HTML (detail_description)
-- 섹션 순서: 디자인 시스템 → STEP → CMP
-- Supabase SQL Editor에서 실행. company 컬럼이 다르면 WHERE 조건만 수정.

UPDATE career
SET
  detail_description = $detail$
<section>
  <h3>디자인 시스템 개발</h3>
  <p><strong>2024. 08 ~ 현재</strong></p>
  <h4>소개</h4>
  <p>디자인·퍼블리싱을 일관되게 적용해 UI를 빠르게 구성할 수 있는 디자인 시스템을 구축했습니다. Atomic 디자인으로 버튼, 인풋, 콤보박스, 체크박스, 라디오 등 컴포넌트를 속성 타입별로 제공하고, 이를 조합한 Molecular 컴포넌트(List Table, Detail Group, Tab List, Search Filter 등)를 사용할 수 있게 했습니다.</p>
  <p>Storybook에 정의된 컴포넌트 메타데이터를 활용해 MCP 서버를 구성하고, 바이너리를 라이브러리 아티팩트로 배포해 실제 프로젝트에서 MCP 클라이언트로 조회·연동할 수 있게 적용했습니다.</p>
  <h4>사용 스킬</h4>
  <p>Next.js, TypeScript, Tailwind CSS, Daisy UI, Storybook, MCP</p>
  <h4>역할</h4>
  <ul>
    <li>CDD 기반 프로젝트에서 바로 쓸 수 있는 컴포넌트 구성</li>
    <li>다양한 type으로 UI를 제공하고 손쉽게 커스터마이징 가능하도록 설계</li>
    <li>Storybook CSF·args·docs 메타데이터를 스키마화해 MCP 도구(tools/resources) 계약을 정의하고, 컴포넌트 API·사용 예·제약 사항을 에이전트·IDE가 조회할 수 있게 노출</li>
    <li>MCP 서버 구현·운영: 로컬·CI에서 바이너리 빌드, 패키지 레지스트리(또는 내부 라이브러리)에 아티팩트 적재, 버전·채널 정책으로 제품 레포와 동기화</li>
    <li>Cursor 등 MCP 클라이언트 연동 가이드·프롬프트 템플릿 정리, 팀 내 온보딩 및 코드 생성·리뷰 워크플로에 MCP를 끼워 넣어 재사용 경로 단축</li>
  </ul>
  <h4>성과</h4>
  <ul>
    <li>내부 프로젝트 도입 후 일반적인 개발 대비 개발 시간 30% 이상 단축</li>
    <li>MCP 도입 이후 STEP 페이지 기준 디자인 시스템 컴포넌트 활용 비중이 페이지 내 일반(비체계) 컴포넌트 대비 약 70~80%p 이상 증가</li>
  </ul>
</section>
<hr />
<section>
  <h3>CLAi · STEP (고객서비스포털)</h3>
  <p><strong>2024. 08 ~ 현재</strong></p>
  <h4>소개</h4>
  <p>클라우드를 사용하는 클라이언트와 클라이언트·계약을 관리하는 MSP 팀이 쓰는 사용자 친화적 서비스 포털입니다. 추후 SRM, CMP와 통합되어 고객이 최초로 접하는 게이트웨이 포털 역할을 합니다.</p>
  <p>멀티모달 파이프라인과 벡터 DB 기반 RAG로 계약서를 분석하고, 시스템에 등록된 상품·담당자 정보와 연결해 화면에 반영할 수 있도록 구현했습니다.</p>
  <h4>사용 스킬</h4>
  <p>Next.js, TypeScript, Tailwind CSS, Daisy UI, Playwright, Jest</p>
  <h4>역할</h4>
  <ul>
    <li>퍼블리싱 및 프론트엔드 개발</li>
    <li>애자일 조직에 맞춘 프론트엔드 개발 리딩</li>
    <li>디자인 시스템을 적용한 CDD 기반 프로젝트 설계</li>
    <li><code>data-testid</code> 기반 선택자로 Playwright·Jest를 활용한 TDD 및 QA 시나리오·회귀 테스트 설계</li>
  </ul>
</section>
<hr />
<section>
  <h3>CMP 도입 및 고도화</h3>
  <p><strong>2024. 08 ~ 현재</strong></p>
  <h4>소개</h4>
  <p>Cloud Management Platform 도입을 위한 개발·고도화를 담당합니다. 고객 IT 서비스 향상과 전사적 비즈니스 과제 해결을 목표로 하며, 비용 관리(Cost Management)와 청구 대시보드(Billing Dashboard)를 플랫폼화해 운영합니다.</p>
  <h4>사용 스킬</h4>
  <p>Next.js, TypeScript, Grafana</p>
  <h4>역할</h4>
  <ul>
    <li>대시보드 템플릿 개발 및 적용</li>
    <li>비용을 쉽게 확인·관리할 수 있는 UI 개발</li>
  </ul>
</section>
$detail$,
  career_tech_stack = ARRAY[
    'Next.js',
    'TypeScript',
    'Tailwind CSS',
    'Daisy UI',
    'Playwright',
    'Jest',
    'Grafana',
    'Storybook',
    'MCP',
    'RAG',
    'Vector DB'
  ]::text[],
  achievements = '{}'::text[],
  updated_at = NOW()
WHERE company = '(주)아이티센클로잇';
