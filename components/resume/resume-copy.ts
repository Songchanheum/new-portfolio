/** 이력서 표지·인쇄 본문에서 공통으로 쓰는 문구 */
export const RESUME_MASTHEAD = {
  name: '송찬흠',
  role: '웹 프론트엔드 개발자 · 수석',
  bio: 'AI를 협업자로 활용하며 전 영역을 넘나드는 9년차 개발자. 경험을 먼저 설계하고 기술로 구현합니다.',
} as const

export const RESUME_PERSONAL = {
  birth: '1992. 12. 12',
  address: '인천 동구',
  email: 'bsk9212@gmail.com',
  phone: '010-4100-7802',
} as const

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
  { id: 'certifications', label: '자격증', sub: 'Certifications', href: '/resume/certifications' as const },
  { id: 'activities', label: '대내외활동', sub: 'Activities', href: '/resume/activities' as const },
] as const
