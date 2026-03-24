"use client"

import { useRef, useEffect, useCallback } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const DRAG_SENSITIVITY = 0.4 // px → deg
const SCROLL_THRESHOLD = 50 // 누적 delta가 이 값을 넘으면 카드 1장 이동

export function useCylindricalDrag(
  setCurrentCardIndex: (index: number) => void,
  isEntryComplete: boolean,
  cardCount: number = 5,
  isLocked: boolean = false
) {
  const anglePerCard = cardCount > 0 ? 360 / cardCount : 72

  const totalSteps = useRef(0)
  const dragStartX = useRef(0)
  const isDragging = useRef(false)
  const scrollAccumulator = useRef(0)

  const rawRotation = useMotionValue(0)
  // 과감쇠 스프링: 빠르게 도착, 오버슈팅 없음
  const springRotation = useSpring(rawRotation, { stiffness: 400, damping: 45 })

  const commitSteps = (steps: number) => {
    totalSteps.current = steps
    rawRotation.set(-steps * anglePerCard)
    const displayIndex = ((Math.round(steps) % cardCount) + cardCount) % cardCount
    setCurrentCardIndex(displayIndex)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!isEntryComplete || isLocked) return
    isDragging.current = true
    dragStartX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const delta = e.clientX - dragStartX.current
    rawRotation.set(-totalSteps.current * anglePerCard + delta * DRAG_SENSITIVITY)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    const delta = e.clientX - dragStartX.current
    const stepsFromDrag = (-delta * DRAG_SENSITIVITY) / anglePerCard
    commitSteps(totalSteps.current + Math.round(stepsFromDrag))
  }

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!isEntryComplete || isLocked) return

    // wheel 이벤트 발원지가 스크롤 가능한 컨테이너 안에 있으면 캐러셀이 가로채지 않음
    // (챗봇 패널 등 내부 스크롤 영역 보호)
    let el = e.target as Element | null
    while (el && el !== document.documentElement) {
      const overflowY = window.getComputedStyle(el).overflowY
      if ((overflowY === 'scroll' || overflowY === 'auto') && el.scrollHeight > el.clientHeight) {
        return
      }
      el = el.parentElement
    }

    e.preventDefault()
    const dominant = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
    scrollAccumulator.current += dominant

    if (Math.abs(scrollAccumulator.current) >= SCROLL_THRESHOLD) {
      const direction = scrollAccumulator.current > 0 ? 1 : -1
      commitSteps(totalSteps.current + direction)
      scrollAccumulator.current = 0
    }
  }, [isEntryComplete, isLocked])

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [handleWheel])

  const goToIndex = useCallback((targetIndex: number) => {
    const currentDisplay = ((Math.round(totalSteps.current) % cardCount) + cardCount) % cardCount
    let diff = targetIndex - currentDisplay
    if (diff > cardCount / 2) diff -= cardCount
    if (diff < -cardCount / 2) diff += cardCount
    const newSteps = totalSteps.current + diff
    totalSteps.current = newSteps
    rawRotation.set(-newSteps * anglePerCard)
    const displayIndex = ((Math.round(newSteps) % cardCount) + cardCount) % cardCount
    setCurrentCardIndex(displayIndex)
  }, [cardCount, rawRotation, setCurrentCardIndex])

  return { springRotation, onPointerDown, onPointerMove, onPointerUp, goToIndex }
}
