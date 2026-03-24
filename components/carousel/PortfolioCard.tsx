"use client"

import { motion, useTransform } from 'framer-motion'

import { cn } from '@/lib/utils'
import { htmlToPlainTextPreview } from '@/lib/wysiwyg'
import type { CardData, CardType } from '@/types'
import type { MotionValue } from 'framer-motion'

const CARD_TYPE_LABEL: Record<CardType, string> = {
  intro: '소개',
  developer: '강점',
  career: '경력',
  projects: '프로젝트',
  topic: '토픽',
}

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
  const topicActive = isActive && card.type === 'topic'

  const cardRotateX = useTransform(mouseY, [0, windowSize.h], [maxTilt, -maxTilt])
  const cardRotateY = useTransform(mouseX, [0, windowSize.w], [-maxTilt, maxTilt])

  const activeCardShadow =
    '0 0 0 1px rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.55), 0 0 60px -12px rgba(100, 160, 255, 0.18), inset 0 1px 0 rgba(255,255,255,0.12)'

  const detailPreview =
    isActive && card.type !== 'topic'
      ? card.type === 'intro' || card.type === 'developer'
        ? htmlToPlainTextPreview(card.detail ?? '')
        : (card.detail ?? '').trim()
      : ''

  const cardSurfaceClass = isActive
    ? 'items-stretch justify-start px-6 py-5 gap-2.5 border-white/22 bg-linear-to-b from-white/14 via-white/7 to-white/3'
    : 'items-center justify-center p-5 border-white/8 bg-white/4'

  return (
    <div
      className="absolute"
      style={{
        transform: `rotateY(${rotationAngle}deg) translateZ(var(--carousel-radius))`,
      }}
    >
      <motion.div
        className={cn(
          'w-80 rounded-xl border flex flex-col select-none cursor-pointer overflow-hidden',
          cardSurfaceClass,
        )}
        style={{
          minHeight: isActive ? (topicActive ? 168 : 204) : 184,
          height: isActive ? 'auto' : 184,
          rotateX: cardRotateX,
          rotateY: cardRotateY,
          boxShadow: isActive
            ? activeCardShadow
            : '0 4px 16px rgba(0,0,0,0.4)',
        }}
        initial={{ x: scatterX, y: scatterY, opacity: 0, scale: 0.6 }}
        animate={{
          x: 0,
          y: 0,
          opacity: isActive || isHighlighted ? 1 : 0.35,
          scale: isHighlighted ? 1.08 : (isActive ? 1 : 0.88),
        }}
        whileHover={isActive ? { scale: 1.06 } : {}}
        transition={{
          default: {
            delay: index * 0.12,
            duration: 0.75,
            ease: [0.22, 1, 0.36, 1],
          },
          scale: { delay: 0, duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
          opacity: { delay: index * 0.12, duration: 0.6, ease: 'easeOut' },
        }}
        onAnimationComplete={onEntryComplete}
        onClick={onClick}
        onMouseEnter={() => isActive && onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        onHoverStart={() => isActive && (document.body.style.setProperty('--card-will-change', 'transform'))}
        onHoverEnd={() => document.body.style.removeProperty('--card-will-change')}
      >
        {isActive && (
          <>
            <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-sky-200/75">
              {CARD_TYPE_LABEL[card.type]}
            </p>
            <div
              className="h-px w-12 shrink-0 rounded-full bg-linear-to-r from-sky-400/75 to-violet-400/65"
              aria-hidden
            />
          </>
        )}

        {topicActive ? (
          <div className="flex min-h-0 flex-1 flex-col justify-center">
            <p className="text-center text-[13px] sm:text-[14px] font-semibold leading-[1.45] text-white tracking-[-0.02em] max-w-[17rem] mx-auto">
              {card.keyword}
            </p>
          </div>
        ) : (
          <p
            className={cn(
              isActive
                ? 'text-left text-[13px] sm:text-[14px] font-semibold leading-[1.42] text-white tracking-[-0.02em]'
                : 'text-center text-[11px] font-medium leading-snug text-white/60',
            )}
          >
            {card.keyword}
          </p>
        )}

        {detailPreview ? (
          <p className="text-left text-[12px] leading-relaxed text-white/48 line-clamp-3">
            {detailPreview}
          </p>
        ) : null}
      </motion.div>
    </div>
  )
}
