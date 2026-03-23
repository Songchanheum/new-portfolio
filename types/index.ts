// 공유 타입 정의 — 컴포넌트·훅 내부에 공유 타입 정의 금지, 여기에만 작성

export type CardType = 'intro' | 'developer' | 'career' | 'projects' | 'topic'

export type CardData = {
  id: string
  type: CardType
  keyword: string
  detail: string
  displayOrder: number
}

export type CareerData = {
  id: string
  company: string
  companyUrl: string
  role: string
  period: string
  description: string
  displayOrder: number
}

export type ProjectData = {
  id: string
  title: string
  description: string
  techStack: string[]
  thumbnailUrl: string
  projectUrl: string
  displayOrder: number
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

export interface UseDataResult<T> {
  data: T[]
  loading: boolean
  error: string | null
}

export interface PortfolioState {
  currentCardIndex: number // 0~4
  activeLayer: 'career' | 'projects' | null // null = 레이어 닫힘
  isChatbotOpen: boolean
}
// 주의: isLayerOpen 변수 별도 생성 금지 → activeLayer !== null 인라인 사용

// Admin Dashboard Stats
export type AdminTableStat = {
  count: number
  lastModified: string | null  // ISO 8601 string, null = 레코드 없음
}

export type AdminStats = {
  cards: AdminTableStat
  career: AdminTableStat
  projects: AdminTableStat
  chatbotKb: AdminTableStat
}

// Resume 전용 타입
export type SkillData = {
  id: string
  name: string
  category: string   // 'frontend' | 'backend' | 'devops' | 'etc'
  proficiency: string // 'expert' | 'advanced' | 'intermediate'
  context: string
  displayOrder: number
}

export type CertificationData = {
  id: string
  name: string
  issuedBy: string
  issuedAt: string | null
  description: string
  displayOrder: number
}

export type ActivityData = {
  id: string
  title: string
  date: string | null
  description: string
  blogUrl: string
  displayOrder: number
}

export type CareerDetailData = CareerData & {
  detailDescription: string
  achievements: string[]
  careerTechStack: string[]
}

export type ProjectDetailData = ProjectData & {
  detailDescription: string
  role: string
  period: string
  contributions: string
}
