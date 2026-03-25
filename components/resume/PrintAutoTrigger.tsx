'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

/** ?auto=1: 인쇄 대화상자 표시 후 닫히면 afterprint로 보조 창을 닫는다(브라우저·탭 유형에 따라 동작 차이) */
interface Props {
  titleOverride?: string
}

export default function PrintAutoTrigger({ titleOverride }: Props = {}) {
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('auto') !== '1') return
    const y = searchParams.get('y') ?? String(new Date().getFullYear())
    const prevTitle = document.title
    document.title = titleOverride ? `${titleOverride}_${y}` : `송찬흠_이력서_${y}`

    const onAfterPrint = () => {
      window.close()
    }
    window.addEventListener('afterprint', onAfterPrint)

    const id = window.setTimeout(() => {
      window.print()
    }, 500)

    return () => {
      window.removeEventListener('afterprint', onAfterPrint)
      window.clearTimeout(id)
      document.title = prevTitle
    }
  }, [searchParams])

  return null
}
