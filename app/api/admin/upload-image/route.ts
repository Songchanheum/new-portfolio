export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createSupabaseServerClient } from '@/lib/supabase-admin'

// Service Role 클라이언트 — RLS 우회, 스토리지 업로드 전용
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: Request) {
  try {
    // 세션 검증
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 요청' }, { status: 401 })
    }

    // FormData 파싱
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다' }, { status: 400 })
    }

    // MIME 타입 검증
    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: '허용되지 않는 파일 타입입니다 (jpg, png, webp, gif만 허용)' },
        { status: 400 }
      )
    }

    // 크기 검증
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: '파일 크기가 5MB를 초과합니다' },
        { status: 400 }
      )
    }

    // 파일명 sanitize 후 업로드 경로 생성
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = `${Date.now()}-${sanitizedName}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('wysiwyg-images')
      .upload(path, buffer, { contentType: file.type })

    if (uploadError) {
      console.error('[api/admin/upload-image POST] 업로드 실패:', uploadError.message)
      return NextResponse.json({ error: '이미지 업로드에 실패했습니다' }, { status: 500 })
    }

    // Public URL 반환
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage.from('wysiwyg-images').getPublicUrl(path)

    return NextResponse.json({ data: { url: publicUrl } })
  } catch (err) {
    console.error('[api/admin/upload-image POST] 서버 오류:', (err as Error).message)
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
  }
}
