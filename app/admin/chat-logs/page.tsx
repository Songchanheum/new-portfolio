"use client"

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface ChatLog {
  id: string
  session_id: string
  user_message: string
  assistant_message: string
  created_at: string
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

function shortSessionId(id: string): string {
  return id.slice(0, 8)
}

export default function ChatLogsPage() {
  const [logs, setLogs] = useState<ChatLog[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await fetch('/api/admin/chat-logs?limit=100')
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error ?? '조회 실패')
        }
        const json = await res.json()
        setLogs(json.data ?? [])
        setTotal(json.count ?? 0)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchLogs()
  }, [])

  // session_id 기준으로 그룹핑
  const sessionMap = new Map<string, ChatLog[]>()
  for (const log of logs) {
    const arr = sessionMap.get(log.session_id) ?? []
    arr.push(log)
    sessionMap.set(log.session_id, arr)
  }
  const sessions = Array.from(sessionMap.entries())

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Chat Logs</h1>
      <p className="text-gray-400 mb-8">방문자 챗봇 대화 기록 — 총 {total}건</p>

      {loading && <p className="text-gray-500 text-sm">로드 중...</p>}
      {error && <p className="text-red-400 text-sm">오류: {error}</p>}

      {!loading && !error && sessions.length === 0 && (
        <p className="text-gray-600 text-sm">아직 대화 기록이 없습니다.</p>
      )}

      <div className="space-y-4">
        {sessions.map(([sessionId, sessionLogs]) => {
          const first = sessionLogs[sessionLogs.length - 1]
          const isOpen = expanded === sessionId

          return (
            <div
              key={sessionId}
              className="border border-gray-800 rounded-lg bg-gray-900 overflow-hidden"
            >
              {/* 세션 헤더 */}
              <button
                onClick={() => setExpanded(isOpen ? null : sessionId)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-gray-500">
                    #{shortSessionId(sessionId)}
                  </span>
                  <span className="text-sm text-gray-300">
                    {sessionLogs.length}개 대화
                  </span>
                  <span className="text-xs text-gray-600">
                    {formatDate(first.created_at)}
                  </span>
                </div>
                <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
              </button>

              {/* 대화 목록 */}
              {isOpen && (
                <div className="border-t border-gray-800 px-5 py-4 space-y-5">
                  {[...sessionLogs].reverse().map((log) => (
                    <div key={log.id} className="space-y-2">
                      <p className="text-xs text-gray-600">{formatDate(log.created_at)}</p>
                      {/* 사용자 메시지 */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] bg-white/10 rounded-xl px-4 py-2.5 text-sm text-white">
                          {log.user_message}
                        </div>
                      </div>
                      {/* 어시스턴트 응답 */}
                      <div className="flex justify-start">
                        <div className={cn(
                          'max-w-[80%] bg-white/5 rounded-xl px-4 py-2.5 text-sm text-white/80'
                        )}>
                          {log.assistant_message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
