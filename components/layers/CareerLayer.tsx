"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'

import { useCareerData } from '@/hooks/data/useCareerData'

interface CareerLayerProps {
  onClose: () => void
}

export function CareerLayer({ onClose }: CareerLayerProps) {
  const { data: careers } = useCareerData()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-3xl mx-4 my-8 p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-white text-2xl font-bold">경력 타임라인</h2>
          <button
            className="text-white/50 hover:text-white transition-colors text-2xl leading-none"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="relative border-l border-white/20 ml-4">
          {careers.map((career, i) => (
            <motion.div
              key={career.id}
              className="relative pl-8 pb-10 last:pb-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="absolute left-0 top-1 w-3 h-3 -translate-x-[7px] rounded-full bg-white/60 border-2 border-black" />

              <p className="text-white/40 text-xs font-medium mb-1">{career.period}</p>
              <h3 className="text-white text-lg font-semibold">
                {career.companyUrl ? (
                  <a
                    href={career.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white/80 underline underline-offset-2 decoration-white/30 transition-colors"
                  >
                    {career.company}
                  </a>
                ) : (
                  career.company
                )}
              </h3>
              <p className="text-white/60 text-sm mb-2">{career.role}</p>
              <p className="text-white/50 text-sm leading-relaxed">{career.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
