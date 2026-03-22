"use client"

import { useState } from 'react'

import type { PortfolioState } from '@/types'

export function usePortfolioState() {
  const [state, setState] = useState<PortfolioState>({
    currentCardIndex: 0,
    activeLayer: null,
    isChatbotOpen: false,
  })

  return {
    ...state,
    setCurrentCardIndex: (index: number) =>
      setState((prev) => ({ ...prev, currentCardIndex: index })),
    setActiveLayer: (layer: PortfolioState['activeLayer']) =>
      setState((prev) => ({ ...prev, activeLayer: layer })),
    toggleChatbot: () =>
      setState((prev) => ({ ...prev, isChatbotOpen: !prev.isChatbotOpen })),
  }
}
