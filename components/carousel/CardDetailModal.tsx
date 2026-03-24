"use client"

import { motion } from 'framer-motion'
import { WysiwygRenderer } from '@/components/wysiwyg/WysiwygRenderer'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import type { CardData, CardType } from '@/types'

const WYSIWYG_TYPES: CardType[] = ['intro', 'developer', 'topic']

interface CardDetailModalProps {
  card: CardData
  onClose: () => void
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  useLockBodyScroll(true)
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-full max-w-2xl max-h-[min(88dvh,900px)] flex-col rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl px-10 pb-10 pt-12 mx-4 [color-scheme:dark]"
        style={{
          boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 24px 64px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)',
        }}
        initial={{ scale: 0.88, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 z-10 text-white/50 hover:text-white transition-colors text-2xl leading-none"
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        <div className="shrink-0">
          <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">
            {card.type}
          </p>

          <h2 className="text-white text-xl font-semibold leading-snug">
            {card.keyword}
          </h2>
        </div>

        <div className="scrollbar-glass mt-6 min-h-0 flex-1 overflow-y-auto overscroll-y-contain pr-1 [scrollbar-gutter:stable]">
          {WYSIWYG_TYPES.includes(card.type)
            ? (
              <WysiwygRenderer
                html={card.detail}
                className="prose prose-invert max-w-none pb-1"
              />
            ) : (
              <p className="text-white/80 text-base leading-relaxed pb-1">
                {card.detail}
              </p>
            )
          }
        </div>
      </motion.div>
    </motion.div>
  )
}
