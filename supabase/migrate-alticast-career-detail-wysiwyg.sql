-- (주)알티캐스트(알티모빌리티 계열) 경력 상세 — 위지윅 HTML (detail_description)
-- Supabase SQL Editor에서 실행. company 컬럼이 다르면 WHERE 조건만 수정.

UPDATE career
SET
  detail_description = $detail$
<section>
  <h3>OTODMS 서비스 개발</h3>
  <p><strong>2023. 07 ~ 2023. 11</strong></p>
  <h4>소개</h4>
  <p>모빌리티 하드웨어 Device 관련 Management Service입니다. Device 주문·발주 처리를 할 수 있는 Admin Page를 개발했습니다.</p>
  <h4>사용 스킬</h4>
  <p>Next.js, TypeScript, React-Query, SASS, Ant Design</p>
  <h4>역할</h4>
  <ul>
    <li>주문·발주 관련 기능 설계 및 개발</li>
    <li>Ant Design, SASS를 활용한 Atomic UI Components 제작</li>
  </ul>
  <h4>목표</h4>
  <ul>
    <li>동시에 다수의 주문(100건)을 안정적으로 처리, Memoization</li>
    <li>Device 설치기사 앱과의 동시다발적인 데이터 연동을 안전하게 처리</li>
  </ul>
</section>
<hr />
<section>
  <h3>RAiDEA 서비스 관리자용 Admin Page 개발 및 유지보수</h3>
  <p><strong>2021. 12 ~ 2024. 03</strong></p>
  <h4>소개</h4>
  <p>Mobility Service Platform RAiDEA 서비스의 Admin Page 개발에 참여했습니다. 성능 향상을 위한 지속적인 리팩터링 및 신기술 도입을 통해 개발을 진행했습니다.</p>
  <h4>사용 스킬</h4>
  <p>React, Redux, Styled-components, Ant Design</p>
  <h4>역할</h4>
  <ul>
    <li>자원 관리(차량, 스테이션, 거점, 카드, 단말, 모델 등) 메뉴 개발 및 유지보수</li>
    <li>차량 예약 관리 메뉴 개발 및 유지보수</li>
  </ul>
  <h4>성과</h4>
  <ul>
    <li>국내외 다수 서비스 런칭</li>
  </ul>
</section>
<hr />
<section>
  <h3>CarfreeCar ERP Web 서비스 개발</h3>
  <p><strong>2024. 03 ~ 현재</strong></p>
  <h4>소개</h4>
  <p>투루카(TuruCar) 서비스 내 렌트 관련 통합 서비스인 카프리카 서비스 고도화 프로젝트입니다. 렌터카 업체에서 사용할 수 있는 ERP Web 페이지를 개발했습니다.</p>
  <h4>사용 스킬</h4>
  <p>Next.js, TypeScript</p>
  <h4>역할</h4>
  <ul>
    <li>렌터카 업체에서 사용할 수 있는 편리한 UI 개발</li>
    <li>안정적인 데이터 처리 및 규칙적이지 않은 API에 대응할 수 있는 util 개발</li>
    <li>팀 내 지속적으로 사용할 수 있는 프로젝트 구성 설계</li>
  </ul>
  <h4>목표</h4>
  <ul>
    <li>Server Action을 활용한 비즈니스 로직 관리</li>
    <li>추후 Admin 페이지에서 사용할 수 있는 CRUD UI 공통 컴포넌트 구성</li>
  </ul>
</section>
$detail$,
  career_tech_stack = ARRAY[
    'Next.js',
    'TypeScript',
    'React',
    'React-Query',
    'Redux',
    'SASS',
    'Styled-components',
    'Ant Design'
  ]::text[],
  achievements = '{}'::text[],
  updated_at = NOW()
WHERE company = '(주)알티캐스트';
