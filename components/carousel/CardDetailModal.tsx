"use client"

import { motion } from 'framer-motion'
import type { CardData } from '@/types'

interface CardDetailModalProps {
  card: CardData
  onClose: () => void
}

export function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-2xl mx-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md p-10"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-2xl leading-none"
          onClick={onClose}
          aria-label="닫기"
        >
          ✕
        </button>

        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-4">
          {card.type}
        </p>

        <h2 className="text-white text-xl font-semibold leading-snug mb-6">
          {card.keyword}
        </h2>

        <p className="text-white/80 text-base leading-relaxed">
          {card.detail}
        </p>
      </motion.div>
    </motion.div>
  )
}
