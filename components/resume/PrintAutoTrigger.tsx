'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/** ?auto=1 일 때 폰트·레이아웃 안정화 후 인쇄 대화상자를 연다 */
export default function PrintAutoTrigger() {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('auto') !== '1') return
    const y = searchParams.get('y') ?? String(new Date().getFullYear())
    const prevTitle = document.title
    document.title = `송찬흠_이력서_${y}`
    const id = window.setTimeout(() => {
      window.print()
    }, 500)
    return () => {
      window.clearTimeout(id)
      document.title = prevTitle
    }
  }, [searchParams])

  return null
}
