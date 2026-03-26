# 송찬흠 포트폴리오 — 챗봇 지식베이스 (2026-03-26 갱신)

---

## 개인 정보

이름은 송찬흠입니다. 1992년 12월 12일생으로, 인천 동구에 거주하고 있습니다. 2016년 11월부터 개발을 시작해 현재까지 약 10년차 웹 프론트엔드 개발자입니다.

- 이메일: bsk9212@gmail.com
- 전화: 010-4100-7802
- GitHub: https://github.com/Songchanheum
- 포트폴리오: https://portfolio.songsdev.kr/
- 이력서: https://portfolio.songsdev.kr/resume

---

## 소개 및 개발 철학

웹 프론트엔드 중심으로 약 10년간 SI, OTT, 모빌리티, 클라우드 MSP 등 성격이 다른 도메인에서 일했습니다. 화면 구현과 퍼블리싱을 넘어 설계와 리딩을 맡아 왔고, 디자인 시스템과 테스트 자동화로 팀의 개발 속도와 품질을 함께 맞추는 데 익숙합니다.

최근에는 클라우드 MSP 고객 포털과 CMP를 담당하며, 계약·운영 프로세스를 제품 안으로 옮기는 작업을 했습니다. 멀티모달과 벡터 DB 기반 RAG로 문서를 해석해 업무 데이터와 화면에 반영하고, 비용·청구 관점의 대시보드(Grafana 등)를 플랫폼 형태로 정리했습니다. Atomic·Molecular 구조의 디자인 시스템을 CDD로 설계하고, Storybook 메타데이터와 MCP 서버·바이너리 배포로 IDE와 에이전트 파이프라인에 연동했습니다. data-testid를 기준으로 Playwright·Jest로 TDD와 QA·회귀 검증을 구성합니다.

AI·MCP·RAG 같은 도구를 업무에 쓰되, 재사용 가능한 컴포넌트와 명세·테스트로 공통층을 두어 팀의 반복 작업을 줄이는 데 무게를 둡니다. 요구사항과 맥락을 먼저 정리한 뒤, 그에 맞는 기술을 골라 구현으로 옮기는 순서를 지킵니다.

직함은 웹 프론트엔드 개발자, AX Engineer입니다. 기술이 사용자에게 어떻게 느껴져야 하는지를 먼저 설계하고, 경계를 넘나들며 실행하는 것을 강점으로 삼고 있습니다.

---

## 기술 스택

### Frontend (전문)

- TypeScript — 타입 안전성·대규모 프론트 코드베이스 유지보수
- React — 컴포넌트 설계, 상태·비동기, 성능 최적화
- Next.js — App Router, SSR/SSG, API Route, 배포

### Frontend (능숙)

- HTML / CSS — 시맨틱 마크업, 반응형·접근성
- Tailwind CSS — 디자인 시스템·유틸리티 기반 UI

### Backend

- Node.js — BFF, 스크립트, 간단한 서버 구성 (능숙)
- REST API — 설계·연동·에러 처리 (능숙)
- PostgreSQL / Supabase — 스키마 설계, RLS·쿼리 (중급)

### DevOps

- Docker — 컨테이너 기반 개발·배포 (능숙)
- CI/CD — 자동 빌드·배포 파이프라인 (능숙)
- AWS — 클라우드 인프라·MSP 프로젝트 경험 (중급)

### 기타

- Git — 브랜치 전략, 코드 리뷰, 협업 (전문)
- Agile / Scrum — 애자일 팀·R&D 협업 (능숙)

### AI / 최신 도구

- Google Gemini API, Claude API (AI 통합)
- RAG, pgvector (벡터 DB 기반 검색)
- MCP (Model Context Protocol) — Storybook 메타데이터 기반 MCP 서버 구축 경험
- Playwright, Jest (TDD·QA 자동화)
- Storybook (CDD·컴포넌트 문서화)

---

## 경력

### (주)아이티센클로잇 — 웹 프론트엔드 개발자, 수석 (2024.08 ~ 현재)

아이티센글로벌 그룹사로, 아이티센글로벌은 매출액 8조 8,707억 원 규모의 회사입니다. 아이티센클로잇은 아이티센그룹의 그룹사로 고객사의 클라우드 전환, 구축 및 운영을 담당하는 총 인원 400명의 중견기업입니다. 새로운 패러다임의 Cloud MSP 사업 개발에 참여하고 있으며, 애자일 기반 R&D 팀 구성으로 CMP 개발 및 고객서비스포털 개발을 담당하였고, AI Agent 사업인 AgentGo2026 프로젝트에 개발 참여하고 있습니다.

사용 기술: Next.js, TypeScript, Tailwind CSS, Daisy UI, Playwright, Jest, Grafana, Storybook, MCP, RAG, Vector DB

#### 프로젝트: 디자인 시스템 개발 (2024.08 ~ 현재)

디자인·퍼블리싱을 일관되게 적용해 UI를 빠르게 구성할 수 있는 디자인 시스템을 구축했습니다. Atomic 디자인으로 버튼, 인풋, 콤보박스, 체크박스, 라디오 등 컴포넌트를 속성 타입별로 제공하고, 이를 조합한 Molecular 컴포넌트(List Table, Detail Group, Tab List, Search Filter 등)를 사용할 수 있게 했습니다. Storybook에 정의된 컴포넌트 메타데이터를 활용해 MCP 서버를 구성하고, 바이너리를 라이브러리 아티팩트로 배포해 실제 프로젝트에서 MCP 클라이언트로 조회·연동할 수 있게 적용했습니다.

성과: 내부 프로젝트 도입 후 일반적인 개발 대비 개발 시간 30% 이상 단축. MCP 도입 이후 STEP 페이지 기준 디자인 시스템 컴포넌트 활용 비중이 약 70~80%p 이상 증가.

#### 프로젝트: CLAi · STEP 고객서비스포털 (2024.08 ~ 현재)

클라우드를 사용하는 클라이언트와 클라이언트·계약을 관리하는 MSP 팀이 쓰는 사용자 친화적 서비스 포털입니다. 추후 SRM, CMP와 통합되어 고객이 최초로 접하는 게이트웨이 포털 역할을 합니다. 멀티모달 파이프라인과 벡터 DB 기반 RAG로 계약서를 분석하고, 시스템에 등록된 상품·담당자 정보와 연결해 화면에 반영할 수 있도록 구현했습니다.

역할: 퍼블리싱 및 프론트엔드 개발, 애자일 조직에 맞춘 프론트엔드 개발 리딩, 디자인 시스템을 적용한 CDD 기반 프로젝트 설계, data-testid 기반 Playwright·Jest TDD 및 QA 시나리오·회귀 테스트 설계.

#### 프로젝트: CMP 도입 및 고도화 (2024.08 ~ 현재)

Cloud Management Platform 도입을 위한 개발·고도화를 담당합니다. 고객 IT 서비스 향상과 전사적 비즈니스 과제 해결을 목표로 하며, 비용 관리(Cost Management)와 청구 대시보드(Billing Dashboard)를 플랫폼화해 운영합니다.

---

### (주)알티캐스트 — 웹 프론트엔드 개발자 (2021.12 ~ 2024.07)

중견기업, 총 137명, 최고매출 466억 원 규모의 회사입니다. 카쉐어링 플랫폼 개발과 국내외 서비스 런칭에 참여했습니다. 사용자 편의성 증가 및 서비스 성장을 위한 지속적인 리팩토링을 진행했습니다.

사용 기술: Next.js, TypeScript, React, React-Query, Redux, SASS, Styled-components, Ant Design

#### 프로젝트: CarfreeCar ERP Web 서비스 개발 (2024.03 ~ 현재)

투루카(TuruCar) 서비스 내 렌트 관련 통합 서비스인 카프리카 서비스 고도화 프로젝트입니다. 렌터카 업체에서 사용할 수 있는 ERP Web 페이지를 개발했습니다. Server Action을 활용한 비즈니스 로직 관리, CRUD UI 공통 컴포넌트 구성.

#### 프로젝트: OTODMS 서비스 개발 (2023.07 ~ 2023.11)

모빌리티 하드웨어 Device 관련 Management Service입니다. Device 주문·발주 처리를 할 수 있는 Admin Page를 개발했습니다. 동시에 다수의 주문(100건)을 안정적으로 처리(Memoization). Ant Design, SASS를 활용한 Atomic UI Components 제작.

#### 프로젝트: RAiDEA 서비스 관리자용 Admin Page 개발 및 유지보수 (2021.12 ~ 2024.03)

Mobility Service Platform RAiDEA 서비스의 Admin Page 개발에 참여했습니다. 자원 관리(차량, 스테이션, 거점, 카드, 단말, 모델 등) 메뉴 개발 및 유지보수, 차량 예약 관리 메뉴 개발. 국내외 다수 서비스 런칭.

---

### (주)에코플래그 — 웹 프론트엔드 개발자, 대리 (2020.11 ~ 2021.11)

스타트업에서 국가 수도 관련 SI 프로젝트를 진행했습니다. 개발리딩 참여, 애자일 방법론 도입, CI/CD 관리를 담당했으며, 프로젝트 솔루션 보일러플레이트를 개발했습니다.

사용 기술: JavaScript, React, GIS, Java, eGov Framework, JPA, GeoServer, PostgreSQL, jQuery

#### 프로젝트: 사물인터넷 기반 상수관망 수질 및 수량 저전력 계측 시스템 개발 (2021.07 ~ 2021.11)

상수관 수질 및 수량 계측 설비 데이터를 이용하여 분석 시스템을 개발했습니다. Front-end, Back-end 개발 및 DB ERD 설계.

#### 프로젝트: 수돗물 수질 이상여부 진단 키트 개발 및 관로 운영지원시스템 구축 (2021.04 ~ 2021.07)

수질 키트를 분석하고 분석 데이터를 저장·표출하는 시스템을 개발했습니다. 모바일 웹(HTTPS, 카메라 사용)과 Admin 반응형 웹 페이지 개발.

#### 프로젝트: 전국오염원조사 DB 및 웹 시스템 구축(4) (2020.11 ~ 2021.04)

전국오염원조사 홈페이지(wems.nier.go.kr) 유지보수 및 고도화. UI/UX 개선 및 디자인 수정.

---

### (주)카피앤페이스트 — 웹/앱 개발자, 대리 (2016.11 ~ 2020.11)

중소기업, 업력 19년차 회사에서 CMS, API, NDK, Socket Server 등 다양한 개발 경험을 쌓았습니다. 5000+ 어플리케이션 서비스 개발에 참여했습니다.

사용 기술: Java, Spring Framework, JavaScript, jQuery, AngularJS, Netty, C, Android NDK, RTSP, MySQL, PostgreSQL, C#, ASP.NET, MS-SQL

#### 프로젝트: TV Coupon 서비스 고도화 — (주)KT (2020.08 ~ 2020.11)

KT STB Mhows 쿠폰 관련 서비스 고도화. 서비스 연동 방식 변경에 따른 API Gateway 구축, 간편 결제·쿠폰 발급 API 연동.

#### 프로젝트: Golfzon Matrix view — (주)Golfzon (2019.06 ~ 2019.11)

Android 앱 Streaming Service 구축. NDK 기반 C 언어 파일 스트리밍 라이브러리 개발. 2019년 Golfzon 안성 H카운티 성공적 런칭.

#### 프로젝트: 인터랙티브 타임슬라이스 서비스 개발 — (주)KT 양재연구소 (2016.12 ~ 2019.03)

KT 타임슬라이스 서비스 개발. 40대 카메라 인코딩 촬영 파일의 프레임 단위 실시간 스트리밍 기능 개발. 성과: 2017 ISU 피겨스케이팅, 2018 평창 올림픽 쇼트트랙, 2018 인도네시아 자카르타 아시안게임, 2019 KT Wiz 수원 야구단 서비스 런칭. 상용 이후 촬영일 기준 일 400~500회 접속(안드로이드 다운로드 5,000+).

#### 프로젝트: MSMS 개발 및 운영 용역 — (주)KTH (2016.11 ~ 2018.12)

Olleh TV Content Service Management System 유지보수 및 고도화. C# → Java migration 참여.

#### 프로젝트: OTT Telebee 통합관리 시스템 구축 및 개발 — ㈜알티캐스트 (2017.03 ~ 2017.09)

OTT 플랫폼 Telebee 서비스의 CMS·BMS 웹 페이지 개발. 2017년 Telebee 서비스 런칭.

---

## 사이드 프로젝트

### proj-0: AI 포트폴리오 (2025.11 ~ 2026, 1인 개발)

기술 스택: Next.js 16.2, React 19, TypeScript 5, Tailwind CSS v4, Framer Motion 12, Tiptap 3, Supabase, Google Gemini API, Vercel

"포트폴리오 자체가 능력의 메타 증거" — BMAD 방법론으로 브레인스토밍부터 설계·구현까지 AI와 함께 체계적으로 만든 인터랙티브 포트폴리오. CSS 3D 캐러셀, 커서 반응 조명, Gemini 기반 AI 챗봇, WYSIWYG 어드민까지.

BMAD(AI 멀티에이전트 오케스트레이션 방법론)를 적용해 Analyst·PM·Architect·Developer·Scrum Master 역할의 AI 에이전트를 순서대로 거쳐 브레인스토밍→PRD(31 FR/13 NFR)→아키텍처→30개 이상 스토리 실행까지 진행했습니다.

주요 기여:

- BMAD 방법론 전 과정 적용 — 브레인스토밍(Values Archaeology·Dream Fusion·SCAMPER)→PRD→아키텍처→스토리 실행
- CSS 3D 원통형 캐러셀 — Three.js 없이 CSS preserve-3d + Framer Motion으로 구현. useMotionValue로 60fps 커서 반응 유지
- Gemini Function Calling 기반 챗봇 — Tool Use로 포트폴리오 카드 실시간 하이라이트. mitt 이벤트 버스로 챗봇↔캐러셀 통신
- Tiptap WYSIWYG + Supabase Storage — Admin에서 작성한 리치 콘텐츠를 XSS 방지 후 방문자에게 렌더링
- 인쇄 최적화 Resume 시스템 — 경력·프로젝트·스킬 데이터를 A4 페이지 분할·여백 최적화 레이아웃으로 제공

기술적 챌린지: Tiptap 번들 크기 관리(dynamic import로 Admin 번들에만 포함), 챗봇·캐러셀 스크롤 충돌 해결, XSS-safe 위지윅 렌더링, Supabase 인증 계층 분리.

---

### proj-4: AI IDE Prototype (2026, 1인 개발)

기술 스택: Next.js, TypeScript, Monaco Editor, Gemini API, React 19, FileSystem Access API, idb-keyval, diff-match-patch

Cursor·GitHub Copilot의 구독 없이, 개인 Google AI 계정으로 바이브코딩 환경을 직접 구현한 웹 기반 AI 코드 에디터 프로토타입. FileSystem Access API + Monaco Editor + Gemini로 로컬 파일을 AI와 함께 편집합니다.

2025년 초 Andrej Karpathy가 정의한 "바이브코딩(Vibe Coding)" 개념에서 시작. Electron 대신 브라우저 기반으로 방향을 잡고, FileSystem Access API로 로컬 프로젝트를 직접 열어 AI와 함께 편집하는 흐름을 구현했습니다.

주요 기여:

- FileSystem Access API로 설치 없이 브라우저에서 로컬 프로젝트를 직접 열고 편집하는 흐름 구현
- 바이브코딩에 최적화된 프롬프트·Rules 설계 — 파일 컨텍스트 주입, 수정 범위 제한, Diff 우선 출력 구조
- Diff 리뷰 UX — AI 제안을 파일별로 수락·거절하는 안전한 편집 흐름 구현
- 한계 직면 후 다음 프로젝트(AI Agent Coder)의 설계 방향 전환에 반영

솔직한 한계: Monaco는 VS Code가 아님(확장 실행 불가, 구문 강조 품질 낮음), Plan→Diff→Accept 흐름의 UX 난이도, 차별점 부재. 이 경험이 AI Agent Coder에서 "IDE를 보여주지 않겠다"는 설계 결정으로 이어졌습니다.

---

### proj-5: AI Agent Coder (2026, 1인 개발)

기술 스택: Next.js, TypeScript, Gemini API, Google Agent Development Kit (ADK), Vercel Sandbox, Tailwind CSS

자연어로 원하는 AI 에이전트를 즉시 생성·테스트할 수 있는 에이전트 빌더. LLM 플래닝 → 바이브코딩 → Sandbox 실행 → ADK 멀티턴 챗봇 검증까지 단일 흐름으로 연결했습니다.

설계 핵심 결정: "IDE를 직접 노출하지 않는다". 사용자가 원하는 건 코드가 아니라 동작하는 에이전트. 자연어 질문 → LLM 플래닝 → 바이브코딩 → 결과 확인 및 수정의 흐름을 설계.

주요 기여:

- IDE 노출 없이 자연어→플래닝→바이브코딩→즉시 테스트로 이어지는 에이전트 생성 흐름 설계 및 구현
- 에이전트 품질을 결정하는 시스템 프롬프트 직접 설계 — 역할·툴·제약 조건 추출 구조화
- Google ADK 도입으로 별도 호스트 없이 오케스트레이션 확보, 멀티턴 챗봇으로 tool 호출 실시간 검증
- Vercel Sandbox로 격리 실행 환경 구성 — 로컬 오염 없이 생성 에이전트 즉시 구동

---

### proj-6: TRIGGER — 카카오톡 총기 강화 게임 (2026, 1인 개발)

기술 스택: Python, Flask, Redis, Vercel, Kakao Chatbot API

카카오톡 채팅방 하나로 총기를 수집·강화하고 다른 유저와 배틀하는 텍스트 RPG. 별도 앱 설치 없이 동시접속자 50명 이상이 플레이한 서버리스 게임입니다.

5개 분류(권총·SMG·소총·저격·특수) × 25종 총기, +0에서 +20까지 강화 레벨, PvP 배틀·랭킹 Top 5, 출석 보상 시스템.

주요 기여:

- 카카오 챗봇 Webhook 기반 게임 루프 전체 설계 및 구현 — 수집·강화·배틀·랭킹·출석 보상
- Redis SETNX Lock으로 동시 요청 레이스 컨디션 방지, 데이터 정합성 확보
- 강화 레벨별 확률 스케일링 곡선 설계 — 긴장감과 반복 플레이 동기 균형
- 서버리스(Vercel) + Redis 아키텍처로 인프라 비용 최소화하며 동시접속자 50+ 트래픽 처리

성과: 출시 후 지인·커뮤니티를 통해 동시접속자 50명 이상 플레이. Redis Lock으로 중복 강화·골드 중복 지급 버그 없이 서비스 안정성 유지.

---

### proj-1: 블로그 페이지 리팩토링 (2024, 1인 개발)

기술 스택: Next.js 14, React Query, Tailwind CSS, Notion API, TypeScript

Markdown 기반 블로그를 Notion을 단일 소스로 두는 구조로 옮기고, Next.js 14와 Notion API·React Query로 조회·캐시 전략을 정리한 리팩토링입니다. 게시글 작성·수정 워크플로를 Notion으로 통일하고, 웹에서는 API로만 읽어 오도록 경계를 나눴습니다.

---

### proj-2: Daily Dev — Instagram Clone Coding (2024, 1인 개발)

기술 스택: Next.js 14, React Query, Tailwind CSS, PWA, TypeScript

매일 읽은 개발 블로그·문서·게시글을 한곳에 모아 두고, Instagram 피드에 가깝게 탐색하는 북마크형 웹앱입니다. PWA를 활용한 모바일 앱 추가 기능 설정 포함.

---

### proj-3: 포트폴리오 페이지 개발 (2023, 1인 개발)

기술 스택: Next.js 13, React Query, Tailwind CSS, Framer Motion, TypeScript

프로필·작업물·이력을 한 사이트에 담고, 인터랙션과 인쇄용 이력서까지 고려한 개인 포트폴리오. Parallax scroll 구현, 인터랙티브 웹 디자인 설계.

---

## 대내외 활동

- Oracle AI Summit 체험 부스 운영 (2026.02) — Oracle · ITCEN Cloit AI AgentGO 2026 플랫폼 설명 및 체험 부스 운영
- AI x SOFTWAVE 2026 AI 부스 운영 (2025.12) — 소프트웨이브 · 아이티센 AI 플랫폼 Think API 설명 부스 운영
- 원티드 프리온보딩 프론트엔드 챌린지 6월 (2024.06) — React 실전: React Hook과 SPA 실전개발
- 원티드 프리온보딩 프론트엔드 챌린지 3월 (2024.03~04) — React 실전 가이드: 면접 및 실무 기술
- 소프트웨어 교육 과정 이수 (2022.11) — 정보통신산업진흥원 AI SW 온라인 코딩입문훈련 교육과정 이수증 취득
- AI SW 온라인 코딩입문훈련 교육과정 (2022.08~11) — 정보통신산업진흥원 / HTML/CSS, JavaScript, Node.js, Express.js, MongoDB
- 사물인터넷(IoT)기반 스마트 웹&앱 개발자 과정 (2016.06~2017.01) — 한국정보과학진흥협회 국비지원 교육 / HTML/CSS, JavaScript, Java, Hadoop, Android, Arduino
- 안양대학교 정보통신공학과 (2011.03~2017.02) — 졸업, 학점 3.5/4.5

---

## 연락처 및 채용 관련

현재 흥미로운 프로젝트나 팀을 찾고 있습니다. 풀스택 개발, AI 통합, 인터랙티브 UI 개발에 관심이 많습니다. 협업 제안이나 문의는 이 챗봇을 통해 남겨주시면 확인 후 연락드리겠습니다.

이메일로도 연락 가능합니다: bsk9212@gmail.com
