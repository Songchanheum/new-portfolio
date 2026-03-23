"use client"

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { cn } from '@/lib/utils'
import type { ChatMessage } from '@/types'
import { ChatbotToolBridge, type ToolCall } from './ChatbotToolBridge'

interface ChatbotPanelProps {
  isOpen: boolean
  onClose: () => void
  cardCount?: number
}

const TOOLS_PREFIX = '__TOOLS__:'

export function ChatbotPanel({ isOpen, onClose, cardCount = 5 }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)
  const [activeToolCalls, setActiveToolCalls] = useState<ToolCall[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isWaiting) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      createdAt: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsWaiting(true)
    setActiveToolCalls([])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      })

      if (!res.ok || !res.body) throw new Error('API error')

      const assistantId = crypto.randomUUID()
      setMessages((prev) => [...prev, {
        id: assistantId, role: 'assistant', content: '', createdAt: new Date(),
      }])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let rawBuffer = ''
      let toolCallsParsed = false

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        rawBuffer += decoder.decode(value, { stream: true })

        if (!toolCallsParsed) {
          // Check for __TOOLS__: prefix at the start
          if (rawBuffer.startsWith(TOOLS_PREFIX)) {
            const newlineIdx = rawBuffer.indexOf('\n')
            if (newlineIdx !== -1) {
              try {
                const toolCallsJson = rawBuffer.slice(TOOLS_PREFIX.length, newlineIdx)
                const parsed = JSON.parse(toolCallsJson) as ToolCall[]
                setActiveToolCalls(parsed)
              } catch {
                // ignore parse errors
              }
              rawBuffer = rawBuffer.slice(newlineIdx + 1)
              toolCallsParsed = true
            }
            // Still waiting for newline — continue accumulating
            continue
          } else {
            toolCallsParsed = true
          }
        }

        // Check for trailing __TOOLS__: (when text came before tool call)
        const trailingToolsIdx = rawBuffer.lastIndexOf('\n' + TOOLS_PREFIX)
        let displayText = rawBuffer
        if (trailingToolsIdx !== -1) {
          const afterPrefix = rawBuffer.slice(trailingToolsIdx + 1 + TOOLS_PREFIX.length)
          const endNewline = afterPrefix.indexOf('\n')
          if (endNewline !== -1) {
            try {
              const parsed = JSON.parse(afterPrefix.slice(0, endNewline)) as ToolCall[]
              setActiveToolCalls(parsed)
            } catch {
              // ignore
            }
            displayText = rawBuffer.slice(0, trailingToolsIdx)
          }
        }

        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: displayText } : m)
        )
      }
    } catch {
      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: 'assistant',
        content: '응답을 받을 수 없습니다. 잠시 후 다시 시도해주세요.',
        createdAt: new Date(),
      }])
    } finally {
      setIsWaiting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <ChatbotToolBridge toolCalls={activeToolCalls} cardCount={cardCount} />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 flex flex-col border-l border-white/15 bg-black/95 backdrop-blur-md"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
              <h2 className="text-white text-base font-semibold">AI 챗봇</h2>
              <button
                className="text-white/50 hover:text-white transition-colors text-xl leading-none"
                onClick={onClose}
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 메시지 목록 */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <p className="text-white/30 text-sm text-center mt-8">
                  궁금한 점을 물어보세요
                </p>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'ml-auto bg-white/10 text-white'
                      : 'mr-auto bg-white/5 text-white/80'
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {isWaiting && (
                <div className="mr-auto max-w-[85%] rounded-xl px-4 py-3 bg-white/5">
                  <span className="text-white/40 text-sm animate-pulse">...</span>
                </div>
              )}
            </div>

            {/* 입력 영역 */}
            <div className="px-5 py-4 border-t border-white/15">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요"
                  className="flex-1 bg-white/5 border border-white/15 rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-white/30 transition-colors"
                  disabled={isWaiting}
                />
                <button
                  onClick={handleSend}
                  disabled={isWaiting || !input.trim()}
                  className={cn(
                    'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    input.trim() && !isWaiting
                      ? 'bg-white/15 text-white hover:bg-white/25'
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  )}
                >
                  전송
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
