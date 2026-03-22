"use client"

import { motion, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'
import type { CardData } from '@/types'
import type { MotionValue } from 'framer-motion'

interface PortfolioCardProps {
  card: CardData
  isActive: boolean
  isHighlighted: boolean
  rotationAngle: number
  index: number
  scatterX: number
  scatterY: number
  isEntryComplete: boolean
  onEntryComplete?: () => void
  onClick: () => void
  onHoverChange: (hovered: boolean) => void
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  windowSize: { w: number; h: number }
}

export function PortfolioCard({
  card,
  isActive,
  isHighlighted,
  rotationAngle,
  index,
  scatterX,
  scatterY,
  onEntryComplete,
  onClick,
  onHoverChange,
  mouseX,
  mouseY,
  windowSize,
}: PortfolioCardProps) {
  const maxTilt = isActive ? 5 : 2

  const cardRotateX = useTransform(mouseY, [0, windowSize.h], [maxTilt, -maxTilt])
  const cardRotateY = useTransform(mouseX, [0, windowSize.w], [-maxTilt, maxTilt])

  return (
    <div
      className="absolute"
      style={{
        transform: `rotateY(${rotationAngle}deg) translateZ(var(--carousel-radius))`,
        willChange: 'transform',
      }}
    >
      <motion.div
        className={cn(
          'w-80 rounded-xl border flex flex-col items-center justify-center p-6 select-none cursor-pointer',
          'transition-colors duration-300 ease-out',
          isActive
            ? 'border-white/30 bg-white/10 shadow-2xl hover:scale-125'
            : 'border-white/10 bg-white/5 hover:opacity-60',
        )}
        style={{
          height: 192,
          rotateX: cardRotateX,
          rotateY: cardRotateY,
        }}
        initial={{ x: scatterX, y: scatterY, opacity: 0, scale: 0.6 }}
        animate={{
          x: 0,
          y: 0,
          opacity: isActive || isHighlighted ? 1 : 0.4,
          scale: isHighlighted ? 1.08 : (isActive ? 1 : 0.9),
          boxShadow: isHighlighted
            ? '0 0 0 2px rgba(255,255,255,0.7), 0 0 30px rgba(255,255,255,0.2)'
            : 'none',
        }}
        transition={{
          default: {
            delay: index * 0.12,
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
          boxShadow: { delay: 0, duration: 0.4, ease: 'easeOut' },
          scale: { delay: 0, duration: 0.4, ease: 'easeOut' },
        }}
        onAnimationComplete={onEntryComplete}
        onClick={onClick}
        onMouseEnter={() => isActive && onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
      >
        <p
          className={cn(
            'text-center font-medium leading-snug',
            isActive ? 'text-white text-sm' : 'text-white/60 text-xs'
          )}
        >
          {card.keyword}
        </p>

        {isActive && card.detail && (
          <p className="text-white/50 text-xs mt-3 text-center line-clamp-2">
            {card.detail}
          </p>
        )}
      </motion.div>
    </div>
  )
}
