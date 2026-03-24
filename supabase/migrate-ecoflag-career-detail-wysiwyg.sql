-- (주)에코플래그 경력 상세 — 위지윅 HTML (detail_description)
-- 프로젝트는 완료(종료) 시점 기준 최신순: 2021.11 → 2021.07 → 2021.04
-- Supabase SQL Editor에서 실행. company 컬럼이 다르면 WHERE 조건만 수정.

UPDATE career
SET
  detail_description = $detail$
<section>
  <h3>사물인터넷 기반 상수관망 수질 및 수량 저전력 계측 시스템 개발</h3>
  <p><strong>2021. 07 ~ 2021. 11</strong></p>
  <h4>업무 내용</h4>
  <p>상수관 수질 및 수량 계측 설비 데이터를 이용하여 분석 시스템을 개발했습니다.</p>
  <h4>사용 스킬</h4>
  <ul>
    <li>FE — JavaScript, React, GIS</li>
    <li>BE — Java / eGov Framework, JPA, GeoServer</li>
    <li>DB — PostgreSQL</li>
  </ul>
  <h4>역할</h4>
  <ul>
    <li>Front-end, Back-end 개발</li>
    <li>DB ERD 설계</li>
  </ul>
</section>
<hr />
<section>
  <h3>수돗물 수질 이상여부 진단 키트 개발 및 비상운전(수계전환 등) 시 안전한 수돗물 공급을 위한 관로 운영지원시스템 구축</h3>
  <p><strong>2021. 04 ~ 2021. 07</strong></p>
  <h4>업무 내용</h4>
  <p>수질 키트를 분석하고 분석 데이터를 저장·표출하는 시스템을 개발했습니다.</p>
  <ul>
    <li><strong>Kit</strong> — 모바일 웹 페이지로 카메라 사용을 위한 HTTPS 배포, 분석한 키트 결과를 DB에 저장</li>
    <li><strong>Admin</strong> — 반응형 웹 페이지 개발, 실시간 분석 데이터 관리 및 UI 표출</li>
  </ul>
  <h4>사용 스킬</h4>
  <ul>
    <li>FE — JavaScript, React, GIS</li>
    <li>BE — Java / eGov Framework, JPA, GeoServer</li>
    <li>DB — PostgreSQL</li>
  </ul>
  <h4>역할</h4>
  <ul>
    <li>Front-end, Back-end 개발</li>
  </ul>
</section>
<hr />
<section>
  <h3>전국오염원조사 DB 및 웹 시스템 구축(4)</h3>
  <p><strong>2020. 11 ~ 2021. 04</strong></p>
  <h4>업무 내용</h4>
  <p>전국오염원조사 홈페이지(<a href="https://wems.nier.go.kr" target="_blank" rel="noopener noreferrer">wems.nier.go.kr</a>) 유지보수 및 고도화</p>
  <h4>사용 스킬</h4>
  <p>Java, JSP, Oracle, jQuery, HTML, CSS</p>
  <h4>역할</h4>
  <ul>
    <li>고도화 개발 참여</li>
    <li>사용자 편의를 위한 UI/UX 개선 및 디자인 수정</li>
  </ul>
</section>
$detail$,
  career_tech_stack = ARRAY[
    'JavaScript',
    'React',
    'GIS',
    'Java',
    'eGov Framework',
    'JPA',
    'GeoServer',
    'PostgreSQL',
    'JSP',
    'Oracle',
    'jQuery',
    'HTML',
    'CSS'
  ]::text[],
  achievements = '{}'::text[],
  updated_at = NOW()
WHERE company = '(주)에코플래그';
