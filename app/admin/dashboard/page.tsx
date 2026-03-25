"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { AdminStats } from '@/types'

const STAT_CARDS = [
  { key: 'cards' as const, label: 'Cards', href: '/admin/cards', description: '캐러셀 카드' },
  { key: 'career' as const, label: 'Career', href: '/admin/career', description: '경력 타임라인' },
  { key: 'projects' as const, label: 'Projects', href: '/admin/projects', description: '프로젝트 그리드' },
  { key: 'chatbotKb' as const, label: 'Chatbot KB', href: '/admin/chatbot-kb', description: 'RAG 지식베이스' },
  { key: 'chatLogs' as const, label: 'Chat Logs', href: '/admin/chat-logs', description: '방문자 대화 기록' },
] as const

function formatDate(iso: string | null): string {
  if (!iso) return '기록 없음'
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error ?? '현황 조회 실패')
        }
        const json = await res.json()
        setStats(json.data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">대시보드</h1>
      <p className="text-gray-400 mb-8">콘텐츠 현황</p>

      {loading && (
        <div className="text-gray-500 text-sm">로드 중...</div>
      )}

      {error && (
        <div className="text-red-400 text-sm">오류: {error}</div>
      )}

      {stats && (
        <div className="grid grid-cols-2 gap-4">
          {STAT_CARDS.map(({ key, label, href, description }) => {
            const stat = stats[key]
            const isEmpty = stat.count === 0

            return (
              <Link
                key={key}
                href={href}
                className={cn(
                  'block p-6 rounded-lg border transition-colors',
                  'border-gray-700 bg-gray-900 hover:border-gray-600 hover:bg-gray-800/50'
                )}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">{description}</span>
                    <h2 className="text-lg font-semibold text-white mt-0.5">{label}</h2>
                  </div>
                  <span
                    className={cn(
                      'text-3xl font-bold',
                      isEmpty ? 'text-gray-600' : 'text-white'
                    )}
                  >
                    {stat.count}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {isEmpty ? (
                    <span className="text-gray-600">항목 없음</span>
                  ) : (
                    <>마지막 수정: {formatDate(stat.lastModified)}</>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
