"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import type { MotionValue } from 'framer-motion'
import type { CardData } from '@/types'

import { portfolioEventBus } from '@/lib/events'
import { useCylindricalDrag } from '@/hooks/interactions/useCylindricalDrag'
import { PortfolioCard } from './PortfolioCard'
import { CardDetailModal } from './CardDetailModal'

const CARD_WIDTH = 320
/** 활성 카드 minHeight·본문 3줄에 맞춘 3D 그룹 기준 높이 */
const CAROUSEL_STAGE_HEIGHT = 220
const CAROUSEL_RADIUS = 350

const BASE_SCATTER: { x: number; y: number }[] = [
  { x: -320, y: -180 },
  { x: 280, y: -200 },
  { x: -250, y: 210 },
  { x: 310, y: 160 },
  { x: 40, y: -260 },
]

function getScatterOffset(i: number): { x: number; y: number } {
  if (i < BASE_SCATTER.length) return BASE_SCATTER[i]
  // 5개 초과 카드는 각도 기반으로 랜덤하게 분산
  const angle = (i / 8) * Math.PI * 2
  return { x: Math.round(Math.cos(angle) * 300), y: Math.round(Math.sin(angle) * 220) }
}

interface CylindricalCarouselProps {
  cards: CardData[]
  currentCardIndex: number
  setCurrentCardIndex: (index: number) => void
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  onOpenLayer: (layer: 'career' | 'projects') => void
  isLocked?: boolean
}

export default function CylindricalCarousel({
  cards,
  currentCardIndex,
  setCurrentCardIndex,
  mouseX,
  mouseY,
  onOpenLayer,
  isLocked = false,
}: CylindricalCarouselProps) {
  const [isEntryComplete, setIsEntryComplete] = useState(false)
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null)
  const [windowSize, setWindowSize] = useState({ w: 1920, h: 1080 })
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    const onResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const cardCount = cards.length
  const anglePerCard = cardCount > 0 ? 360 / cardCount : 72

  const { springRotation, onPointerDown, onPointerMove, onPointerUp, goToIndex } =
    useCylindricalDrag(setCurrentCardIndex, isEntryComplete, cardCount, isCardHovered || !!selectedCard || isLocked)

  const handleCardClick = (card: CardData, index: number) => {
    if (index !== currentCardIndex) {
      goToIndex(index)
    } else if (card.type === 'career' || card.type === 'projects') {
      onOpenLayer(card.type)
    } else {
      setSelectedCard(card)
    }
  }

  const handleHighlightCard = useCallback(
    ({ index }: { index: number }) => {
      setHighlightedIndex(index)
      goToIndex(index)
      setTimeout(() => setHighlightedIndex(null), 5000)
    },
    [goToIndex]
  )

  useEffect(() => {
    portfolioEventBus.on('highlight_card', handleHighlightCard)
    return () => {
      portfolioEventBus.off('highlight_card', handleHighlightCard)
    }
  }, [handleHighlightCard])

  return (
    <>
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="relative cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: 'preserve-3d',
            rotateY: springRotation,
            width: CARD_WIDTH,
            height: CAROUSEL_STAGE_HEIGHT,
            ['--carousel-radius' as string]: `${CAROUSEL_RADIUS}px`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {cards.map((card, i) => (
            <PortfolioCard
              key={card.id}
              card={card}
              index={i}
              isActive={i === currentCardIndex}
              isHighlighted={i === highlightedIndex}
              rotationAngle={i * anglePerCard}
              scatterX={getScatterOffset(i).x}
              scatterY={getScatterOffset(i).y}
              isEntryComplete={isEntryComplete}
              onEntryComplete={i === cardCount - 1 ? () => setIsEntryComplete(true) : undefined}
              onClick={() => handleCardClick(card, i)}
              onHoverChange={setIsCardHovered}
              mouseX={mouseX}
              mouseY={mouseY}
              windowSize={windowSize}
            />
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
