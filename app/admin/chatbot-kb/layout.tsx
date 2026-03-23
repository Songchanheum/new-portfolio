"use client"

// chatbot-kb 섹션 공통 레이아웃 — breadcrumb 제공 (선택적)
// chunks 페이지의 "← Chatbot KB" 링크와 중복되므로 필수 아님

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function ChatbotKbLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isChunksPage = pathname.startsWith('/admin/chatbot-kb/chunks')

  return (
    <div className="flex flex-col">
      {/* breadcrumb — chunks 하위 경로에서만 표시 */}
      {isChunksPage && (
        <nav className="px-8 pt-6 pb-0">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li>
              <Link href="/admin/chatbot-kb" className="hover:text-white transition-colors">
                Chatbot KB
              </Link>
            </li>
            <li className="text-gray-600">/</li>
            <li className="text-gray-200">청크 목록</li>
          </ol>
        </nav>
      )}
      {children}
    </div>
  )
}
