"use client"

import { useEffect } from 'react'

/**
 * body 스크롤을 잠그고 해제 시 이전 위치를 복원하는 훅.
 * overflow: hidden 단독 사용 시 모바일에서 스크롤이 막히지 않는 경우가 있어
 * position: fixed + top: -scrollY 세트 패턴을 사용한다.
 */
export function useLockBodyScroll(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const scrollY = window.scrollY
    document.body.style.overflow = 'hidden'
    document.body.style.position = 'fixed'
    document.body.style.top = `-${scrollY}px`
    document.body.style.width = '100%'
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      window.scrollTo(0, scrollY)
    }
  }, [locked])
}
