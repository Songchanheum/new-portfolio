import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Server Component / Route Handler에서 호출하는 인증 Supabase 클라이언트.
 * 쿠키 기반 세션 관리를 위해 @supabase/ssr 사용.
 * SUPABASE_SERVICE_ROLE_KEY는 사용하지 않음 — 세션 검증 전용.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Server Component에서는 쿠키 설정 불가 — 무시
          }
        },
      },
    }
  )
}
