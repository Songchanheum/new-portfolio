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
    projectUrl: '',
    displayOrder: 0,
  },
  {
    id: 'proj-1',
    title: '블로그 페이지 리팩토링',
    description:
      'Markdown 기반 블로그를 Notion을 단일 소스로 두는 구조로 옮기고, Next.js 14와 Notion API·React Query로 조회·캐시 전략을 정리한 리팩토링입니다.',
    techStack: ['Next.js 14', 'React Query', 'Tailwind CSS', 'Notion API', 'TypeScript'],
    thumbnailUrl: '',
    projectUrl: '',
    displayOrder: 1,
  },
  {
    id: 'proj-2',
    title: 'Daily Dev (Instagram Clone Coding)',
    description:
      '매일 읽은 개발 블로그·문서·게시글을 한곳에 모아 Instagram 피드에 가깝게 탐색하는 북마크형 웹앱입니다. 포트폴리오 도메인 root를 활용했습니다.',
    techStack: ['Next.js 14', 'React Query', 'Tailwind CSS', 'PWA', 'TypeScript'],
    thumbnailUrl: '',
    projectUrl: '',
    displayOrder: 2,
  },
  {
    id: 'proj-3',
    title: '포트폴리오 페이지 개발',
    description:
      '프로필·작업물·이력을 한 사이트에 담고, 인터랙션과 인쇄용 이력서까지 고려한 개인 포트폴리오입니다. App Router layout으로 /resume과 /main을 분리했습니다.',
    techStack: ['Next.js 13', 'React Query', 'Tailwind CSS', 'Framer Motion', 'TypeScript'],
    thumbnailUrl: '',
    projectUrl: '',
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
          .select('id, title, description, tech_stack, thumbnail_url, project_url, display_order')
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
              projectUrl: r.project_url ?? '',
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
