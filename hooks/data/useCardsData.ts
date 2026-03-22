"use client"

import { useState, useEffect } from 'react'

import { supabase } from '@/lib/supabase'
import type { CardData, UseDataResult } from '@/types'

const HARDCODED_CARDS: CardData[] = [
  {
    id: 'card-0',
    type: 'intro',
    keyword: 'AI를 탐구하고, 전 영역을 넘나들며, 공백을 채우는 개발자',
    detail: '프론트엔드부터 백엔드, 인프라까지 — 필요한 곳이면 어디든 뛰어들었습니다. AI를 단순한 도구가 아니라 사고의 확장으로 활용하며, 팀에서 비어 있는 역할을 스스로 찾아 채웁니다.',
    displayOrder: 0,
  },
  {
    id: 'card-1',
    type: 'developer',
    keyword: '기술이 인간에게 어떻게 느껴져야 하는가를 설계합니다',
    detail: '좋은 기술은 사용자가 의식하지 못할 때 완성됩니다. 인터페이스의 무게, 반응의 속도, 전환의 리듬 — 눈에 보이지 않는 디테일이 경험을 결정합니다.',
    displayOrder: 1,
  },
  {
    id: 'card-2',
    type: 'career',
    keyword: '디자이너 없이도 방향을 잡고, 기획자 없이도 결정을 내렸던 순간들',
    detail: '클릭하면 경력 타임라인을 볼 수 있습니다. 스타트업부터 엔터프라이즈까지, 기획·디자인·개발을 넘나들며 빈자리를 채워온 여정입니다.',
    displayOrder: 2,
  },
  {
    id: 'card-3',
    type: 'projects',
    keyword: 'AI와 함께 만든 것들 — 코드보다 경험을 먼저 설계했습니다',
    detail: '클릭하면 사이드 프로젝트들을 탐험할 수 있습니다. AI와 함께 아이디어를 프로토타이핑하고, 경험부터 역순으로 설계한 프로젝트들입니다.',
    displayOrder: 3,
  },
  {
    id: 'card-4',
    type: 'topic',
    keyword: 'AI는 도구가 아니라 협업자다 — 그걸 어떻게 느끼게 할 것인가',
    detail: 'AI가 명령을 수행하는 도구에 머무는 한, 진짜 가치는 드러나지 않습니다. AI와 함께 사고하고, 함께 만들고, 그 과정 자체를 사용자에게 체감시키는 것이 목표입니다.',
    displayOrder: 4,
  },
]

export function useCardsData(): UseDataResult<CardData> {
  const [data, setData] = useState<CardData[]>(HARDCODED_CARDS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCards() {
      try {
        const { data: rows, error: err } = await supabase
          .from('cards')
          .select('id, type, keyword, detail, display_order')
          .order('display_order')

        if (err) throw err
        if (rows && rows.length > 0) {
          setData(
            rows.map((r) => ({
              id: r.id,
              type: r.type,
              keyword: r.keyword,
              detail: r.detail,
              displayOrder: r.display_order,
            }))
          )
        }
      } catch (err) {
        console.error('[useCardsData] Supabase 조회 실패:', (err as Error).message)
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  return { data, loading, error }
}
