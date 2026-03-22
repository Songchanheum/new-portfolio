"use client"

import { useState, useEffect } from 'react'

import { supabase } from '@/lib/supabase'
import type { CareerData, UseDataResult } from '@/types'

const HARDCODED_CAREER: CareerData[] = [
  {
    id: 'career-0',
    company: '프리랜서 / 1인 개발',
    role: '풀스택 개발자',
    period: '2024.01 — 현재',
    description: 'AI를 활용한 프로토타이핑과 사이드 프로젝트를 주도. 기획부터 디자인, 개발, 배포까지 전 과정을 1인으로 수행하며 경험 중심의 제품 설계 역량을 강화.',
    displayOrder: 0,
  },
  {
    id: 'career-1',
    company: '스타트업 A',
    role: '프론트엔드 리드',
    period: '2022.03 — 2023.12',
    description: '디자이너 없이 UI/UX를 직접 설계하고, 기획자 없이 제품 방향을 결정. React + TypeScript 기반 SPA를 구축하고 팀의 기술적 의사결정을 리드.',
    displayOrder: 1,
  },
  {
    id: 'career-2',
    company: '스타트업 B',
    role: '풀스택 개발자',
    period: '2020.06 — 2022.02',
    description: '백엔드 API 설계부터 프론트엔드 구현, 인프라 구축까지 전 영역을 담당. 빈자리를 스스로 찾아 채우며 팀의 기술 부채를 줄이는 데 집중.',
    displayOrder: 2,
  },
  {
    id: 'career-3',
    company: '엔터프라이즈 C',
    role: '주니어 개발자',
    period: '2018.09 — 2020.05',
    description: '대규모 레거시 시스템의 현대화 프로젝트에 참여. Java/Spring 기반 백엔드와 jQuery → React 마이그레이션을 경험하며 엔터프라이즈 개발의 기초를 다짐.',
    displayOrder: 3,
  },
]

export function useCareerData(): UseDataResult<CareerData> {
  const [data, setData] = useState<CareerData[]>(HARDCODED_CAREER)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCareer() {
      try {
        const { data: rows, error: err } = await supabase
          .from('career')
          .select('id, company, role, period, description, display_order')
          .order('display_order')

        if (err) throw err
        if (rows && rows.length > 0) {
          setData(
            rows.map((r) => ({
              id: r.id,
              company: r.company,
              role: r.role,
              period: r.period,
              description: r.description,
              displayOrder: r.display_order,
            }))
          )
        }
      } catch (err) {
        console.error('[useCareerData] Supabase 조회 실패:', (err as Error).message)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCareer()
  }, [])

  return { data, loading, error }
}
