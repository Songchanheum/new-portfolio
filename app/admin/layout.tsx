"use client"

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: '대시보드' },
  { href: '/admin/cards', label: 'Cards' },
  { href: '/admin/career', label: 'Career' },
  { href: '/admin/projects', label: 'Projects' },
  { href: '/admin/skills', label: 'Skills' },
  { href: '/admin/certifications', label: 'Certifications' },
  { href: '/admin/activities', label: 'Activities' },
  { href: '/admin/chatbot-kb', label: 'Chatbot KB' },
  { href: '/admin/chat-logs', label: '챗봇 로그' },
] as const

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  async function handleLogout() {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/admin/login')
        router.refresh()
      }
    } catch (err) {
      console.error('[AdminLayout] 로그아웃 실패:', (err as Error).message)
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">
      {/* 사이드바 */}
      <aside className="w-52 flex-shrink-0 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <span className="text-sm font-semibold text-gray-400">Admin</span>
        </div>
        <nav className="flex-1 p-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block px-3 py-2 rounded text-sm transition-colors',
                pathname === item.href
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-gray-400 hover:text-white rounded hover:bg-gray-800/50 transition-colors text-left"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
