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
  {
    id: 'proj-4',
    title: 'AI IDE Prototype',
    description:
      'Google Gemini API로 구동되는 AI 코드 에디터 프로토타입. 로컬 파일 시스템 접근, Monaco 에디터, 코드 변경 Diff 뷰어를 갖춘 AI 채팅 기반 IDE입니다.',
    techStack: ['Next.js', 'TypeScript', 'Monaco Editor', 'Gemini API', 'React 19'],
    thumbnailUrl: '',
    projectUrl: '',
    displayOrder: 4,
  },
  {
    id: 'proj-5',
    title: 'AI Agent Coder',
    description:
      '자연어로 AI 에이전트를 설계·생성하고, ADK 오케스트레이션과 Vercel Sandbox 위에서 즉석 테스트할 수 있는 에이전트 빌더 앱. 멀티턴 챗봇으로 만든 에이전트와 바로 대화할 수 있습니다.',
    techStack: ['Next.js', 'TypeScript', 'Gemini API', 'Agent Development Kit', 'Vercel Sandbox', 'Tailwind CSS'],
    thumbnailUrl: '',
    projectUrl: '',
    displayOrder: 5,
  },
  {
    id: 'proj-6',
    title: 'TRIGGER — 카카오톡 총기 강화 게임',
    description:
      '카카오톡 챗봇으로 즐기는 텍스트 기반 총기 강화 RPG. 5개 분류 25종 총기를 +20까지 강화하고, PvP 배틀·랭킹·출석 보상을 갖춘 Python Flask 서버리스 게임입니다.',
    techStack: ['Python', 'Flask', 'Redis', 'Vercel', 'Kakao Chatbot API'],
    thumbnailUrl: '',
    projectUrl: '',
    displayOrder: 6,
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
