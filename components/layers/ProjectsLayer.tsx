"use client"

import { useEffect } from 'react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'
import { useProjectsData } from '@/hooks/data/useProjectsData'

interface ProjectsLayerProps {
  onClose: () => void
  highlightedId?: string | null
}

export function ProjectsLayer({ onClose, highlightedId }: ProjectsLayerProps) {
  const { data: projects } = useProjectsData()

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
        className="relative w-full max-w-4xl mx-4 my-8 p-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-white text-2xl font-bold">사이드 프로젝트</h2>
          <button
            className="text-white/50 hover:text-white transition-colors text-2xl leading-none"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              className={cn(
                'rounded-xl border bg-white/5 p-6 hover:bg-white/10 transition-colors',
                highlightedId === project.id
                  ? 'border-white/60 ring-2 ring-white/40 scale-[1.02]'
                  : 'border-white/15'
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              {project.thumbnailUrl && (
                <div className="w-full h-40 rounded-lg bg-white/5 mb-4 overflow-hidden">
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <h3 className="text-white text-lg font-semibold mb-2">{project.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className={cn(
                      'text-xs px-2 py-1 rounded-full',
                      'bg-white/10 text-white/70'
                    )}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
