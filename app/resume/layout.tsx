import type { Metadata } from 'next'
import { Noto_Serif_KR } from 'next/font/google'

const notoSerifKR = Noto_Serif_KR({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '송찬흠 이력서 — Frontend Developer',
  description: '웹 프론트엔드 개발자 송찬흠의 이력서입니다.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: '송찬흠 — Frontend Developer',
    description: '9년차 웹 프론트엔드 개발자. Next.js · React · TypeScript · Supabase',
    type: 'profile',
  },
}

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${notoSerifKR.variable} font-sans`}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

        :root {
          --resume-green: #1a5c38;
          --resume-green-light: #e8f5ed;
          --resume-border: #d1d5db;
          --font-serif: var(--font-noto-serif-kr), 'Noto Serif KR', Georgia, serif;
          --font-sans-resume: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .resume-serif { font-family: var(--font-serif); }
        .resume-sans { font-family: var(--font-sans-resume); }

        @media print {
          @page {
            size: A4;
            margin: 15mm 20mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          a { text-decoration: none; }
        }

        @media screen {
          .print-only { display: none !important; }
        }
      `}</style>
      {children}
    </div>
  )
}
