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
        <p className="text-white/45 text-sm tracking-wide" role="status">
          카드를 불러오는 중…
        </p>
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
