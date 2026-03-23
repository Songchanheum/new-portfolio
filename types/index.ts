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
