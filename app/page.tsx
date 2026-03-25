"use client"

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useMotionValue, AnimatePresence } from 'framer-motion'

import { usePortfolioState } from '@/hooks/interactions/usePortfolioState'
import { useCardsData } from '@/hooks/data/useCardsData'
import { GlobalLighting } from '@/components/lighting/GlobalLighting'
import { CareerLayer } from '@/components/layers/CareerLayer'
import { ProjectsLayer } from '@/components/layers/ProjectsLayer'
import { ChatbotPanel } from '@/components/chatbot/ChatbotPanel'
import { portfolioEventBus } from '@/lib/events'

const CylindricalCarousel = dynamic(
  () => import('@/components/carousel/CylindricalCarousel'),
  { ssr: false }
)

export default function Home() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const { currentCardIndex, setCurrentCardIndex, activeLayer, setActiveLayer, isChatbotOpen, toggleChatbot } = usePortfolioState()
  const { data: cards, loading: cardsLoading, error: cardsError } = useCardsData()
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null)

  useEffect(() => {
    const handleOpenLayer = ({ type }: { type: 'career' | 'projects' }) => {
      setActiveLayer(type)
    }
    const handleShowProject = ({ id }: { id: string }) => {
      setHighlightedProjectId(id)
    }
    portfolioEventBus.on('open_layer', handleOpenLayer)
    portfolioEventBus.on('show_project', handleShowProject)
    return () => {
      portfolioEventBus.off('open_layer', handleOpenLayer)
      portfolioEventBus.off('show_project', handleShowProject)
    }
  }, [setActiveLayer])

  return (
    <main
      className="min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 30% 20%, #0f0f1a 0%, #07070d 50%, #000000 100%)',
      }}
      onMouseMove={(e) => {
        mouseX.set(e.clientX)
        mouseY.set(e.clientY)
      }}
    >
      <GlobalLighting mouseX={mouseX} mouseY={mouseY} />
      {cardsLoading ? (
        <div className="relative flex items-center justify-center" style={{ perspective: '900px' }} aria-hidden>
          {[
            { x: -220, z: -60, scale: 0.88, opacity: 0.25 },
            { x: 0,    z: 0,   scale: 1,    opacity: 0.55 },
            { x: 220,  z: -60, scale: 0.88, opacity: 0.25 },
          ].map((pos, i) => (
            <div
              key={i}
              className="absolute w-80 h-[184px] rounded-xl border border-white/8 overflow-hidden"
              style={{
                transform: `translateX(${pos.x}px) translateZ(${pos.z}px) scale(${pos.scale})`,
                opacity: pos.opacity,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              }}
            >
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-linear-to-r from-transparent via-white/6 to-transparent" />
              <div className="p-5 flex flex-col gap-3">
                <div className="h-2 w-10 rounded-full bg-white/10" />
                <div className="h-px w-12 rounded-full bg-white/8" />
                <div className="h-3.5 w-48 rounded-md bg-white/10" />
                <div className="h-3.5 w-36 rounded-md bg-white/7" />
              </div>
            </div>
          ))}
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center text-white/50 text-sm max-w-sm px-6 space-y-2" role="status">
          <p>표시할 카드가 없습니다.</p>
          {cardsError ? (
            <p className="text-white/35 text-xs break-words">{cardsError}</p>
          ) : null}
        </div>
      ) : (
        <CylindricalCarousel
          cards={cards}
          currentCardIndex={currentCardIndex}
          setCurrentCardIndex={setCurrentCardIndex}
          mouseX={mouseX}
          mouseY={mouseY}
          onOpenLayer={setActiveLayer}
          isLocked={activeLayer !== null}
        />
      )}

      <AnimatePresence>
        {activeLayer === 'career' && (
          <CareerLayer onClose={() => setActiveLayer(null)} />
        )}
        {activeLayer === 'projects' && (
          <ProjectsLayer
            onClose={() => { setActiveLayer(null); setHighlightedProjectId(null) }}
            highlightedId={highlightedProjectId}
          />
        )}
      </AnimatePresence>

      <ChatbotPanel isOpen={isChatbotOpen} onClose={toggleChatbot} cardCount={cards.length} />

      {!isChatbotOpen && (
        <button
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white/10 border border-white/15 text-white/70 hover:bg-white/20 hover:text-white transition-colors text-xl flex items-center justify-center"
          onClick={toggleChatbot}
          aria-label="챗봇 열기"
        >
          💬
        </button>
      )}
    </main>
  )
}
