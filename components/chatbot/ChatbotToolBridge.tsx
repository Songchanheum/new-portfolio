'use client'

import { useEffect } from 'react'

import { portfolioEventBus } from '@/lib/events'

export type ToolCall = { name: string; args: Record<string, unknown> }

interface ChatbotToolBridgeProps {
  toolCalls: ToolCall[]
  cardCount?: number
}

export function ChatbotToolBridge({ toolCalls, cardCount = 5 }: ChatbotToolBridgeProps) {
  useEffect(() => {
    for (const call of toolCalls) {
      if (call.name === 'highlight_card') {
        const index = call.args.index as number
        if (typeof index === 'number' && index >= 0 && index < cardCount) {
          portfolioEventBus.emit('highlight_card', { index })
        }
      }
      if (call.name === 'open_layer') {
        const type = call.args.type as string
        if (type === 'career' || type === 'projects') {
          portfolioEventBus.emit('open_layer', { type })
        }
      }
      if (call.name === 'show_project') {
        const id = call.args.id as string
        portfolioEventBus.emit('open_layer', { type: 'projects' })
        if (id) portfolioEventBus.emit('show_project', { id })
      }
    }
  }, [toolCalls])

  return null
}
