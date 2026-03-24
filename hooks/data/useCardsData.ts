"use client"

import { useState, useEffect } from 'react'

import { supabase } from '@/lib/supabase'
import type { CardData, UseDataResult } from '@/types'

export function useCardsData(): UseDataResult<CardData> {
  const [data, setData] = useState<CardData[]>([])
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
        setData(
          (rows ?? []).map((r) => ({
            id: r.id,
            type: r.type,
            keyword: r.keyword,
            detail: r.detail,
            displayOrder: r.display_order,
          })),
        )
      } catch (err) {
        console.error('[useCardsData] Supabase 조회 실패:', (err as Error).message)
        setError((err as Error).message)
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchCards()
  }, [])

  return { data, loading, error }
}
