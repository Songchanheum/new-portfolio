"use client"

import { useState, useEffect } from 'react'

import { supabase } from '@/lib/supabase'
import type { ProjectData, UseDataResult } from '@/types'

const HARDCODED_PROJECTS: ProjectData[] = [
  {
    id: 'proj-0',
    title: 'AI 포트폴리오',
    description: '이 사이트 자체가 프로젝트입니다. CSS 3D 캐러셀, 커서 반응 조명, AI 챗봇까지 — 경험을 먼저 설계하고 기술을 입힌 인터랙티브 포트폴리오.',
    techStack: ['Next.js', 'Framer Motion', 'Supabase', 'Gemini'],
    thumbnailUrl: '',
    displayOrder: 0,
  },
  {
    id: 'proj-1',
    title: 'AI 코드 리뷰어',
    description: 'PR이 올라오면 자동으로 코드를 분석하고 리뷰 코멘트를 남기는 GitHub Action. 컨텍스트를 이해하는 리뷰를 목표로 설계.',
    techStack: ['TypeScript', 'GitHub Actions', 'Claude API'],
    thumbnailUrl: '',
    displayOrder: 1,
  },
  {
    id: 'proj-2',
    title: '실시간 협업 에디터',
    description: 'WebSocket 기반의 실시간 마크다운 협업 에디터. CRDT 알고리즘으로 충돌 없는 동시 편집을 구현.',
    techStack: ['React', 'WebSocket', 'Y.js', 'Node.js'],
    thumbnailUrl: '',
    displayOrder: 2,
  },
  {
    id: 'proj-3',
    title: '개인 지식 관리 시스템',
    description: '읽은 글, 메모, 아이디어를 벡터 임베딩으로 연결하는 PKM 도구. 관련 노트를 자동으로 추천.',
    techStack: ['Next.js', 'Supabase', 'pgvector', 'OpenAI'],
    thumbnailUrl: '',
    displayOrder: 3,
  },
]

export function useProjectsData(): UseDataResult<ProjectData> {
  const [data, setData] = useState<ProjectData[]>(HARDCODED_PROJECTS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data: rows, error: err } = await supabase
          .from('projects')
          .select('id, title, description, tech_stack, thumbnail_url, display_order')
          .order('display_order')

        if (err) throw err
        if (rows && rows.length > 0) {
          setData(
            rows.map((r) => ({
              id: r.id,
              title: r.title,
              description: r.description,
              techStack: r.tech_stack ?? [],
              thumbnailUrl: r.thumbnail_url ?? '',
              displayOrder: r.display_order,
            }))
          )
        }
      } catch (err) {
        console.error('[useProjectsData] Supabase 조회 실패:', (err as Error).message)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return { data, loading, error }
}
