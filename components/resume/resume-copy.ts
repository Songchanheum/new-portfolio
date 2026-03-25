/** 이력서 표지·인쇄 본문에서 공통으로 쓰는 문구 */
export const RESUME_MASTHEAD = {
  name: '송찬흠',
  role: '웹 프론트엔드 개발자, AX Engineer',
  /** 표지·인쇄 상단 소개 (순서대로 문단) */
  bioParagraphs: [
    '웹 프론트엔드 중심으로 약 10년간 SI, OTT, 모빌리티, 클라우드 MSP 등 성격이 다른 도메인에서 일했습니다. 화면 구현과 퍼블리싱을 넘어 설계와 리딩을 맡아 왔고, 디자인 시스템과 테스트 자동화로 팀의 개발 속도와 품질을 함께 맞추는 데 익숙합니다.',
    '최근에는 클라우드 MSP 고객 포털과 CMP를 담당하며, 계약·운영 프로세스를 제품 안으로 옮기는 작업을 했습니다. 멀티모달과 벡터 DB 기반 RAG로 문서를 해석해 업무 데이터와 화면에 반영하고, 비용·청구 관점의 대시보드(Grafana 등)를 플랫폼 형태로 정리했습니다. Atomic·Molecular 구조의 디자인 시스템을 CDD로 설계하고, Storybook 메타데이터와 MCP 서버·바이너리 배포로 IDE와 에이전트 파이프라인에 연동했습니다. data-testid를 기준으로 Playwright·Jest로 TDD와 QA·회귀 검증을 구성합니다. 그 이전에는 모빌리티·렌터카 운영 웹, 공공·환경 SI, API Gateway와 실시간 스트리밍·OTT, 모바일 네이티브 연동처럼 연속성이 적은 과제들을 폭넓게 경험했습니다.',
    'AI·MCP·RAG 같은 도구를 업무에 쓰되, 재사용 가능한 컴포넌트와 명세·테스트로 공통층을 두어 팀의 반복 작업을 줄이는 데 무게를 둡니다. 요구사항과 맥락을 먼저 정리한 뒤, 그에 맞는 기술을 골라 구현으로 옮기는 순서를 지킵니다.',
  ] as const,
} as const

export const RESUME_PERSONAL = {
  birth: '1992. 12. 12',
  address: '인천 동구',
  email: 'bsk9212@gmail.com',
  phone: '010-4100-7802',
} as const

export const RESUME_LINKS = [
  { label: 'GitHub',      href: 'https://github.com/Songchanheum' },
  { label: 'Portfolio',   href: 'https://portfolio.songsdev.kr/' },
  { label: 'Resume',      href: 'https://portfolio.songsdev.kr/resume' },
] as const

export const SKILL_CATEGORY_LABEL: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  etc: 'Etc',
}

export const SKILL_CATEGORY_ORDER = ['frontend', 'backend', 'devops', 'etc'] as const

export const RESUME_INDEX_NAV = [
  { id: 'career', label: '경력', sub: 'Career', href: '/resume/career' as const },
  { id: 'projects', label: '프로젝트', sub: 'Projects', href: '/resume/projects' as const },
  {
    id: 'certifications',
    label: '자격증',
    sub: 'Certifications',
    href: '/resume/certifications' as const,
  },
  { id: 'activities', label: '대내외활동', sub: 'Activities', href: '/resume/activities' as const },
] as const
