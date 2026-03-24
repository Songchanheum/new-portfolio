import DOMPurify from 'isomorphic-dompurify'

// Tiptap StarterKit + Image extension이 생성하는 태그셋 기준 allowlist
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4',
  'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'img', 'a',
  'div', 'section', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]
const ALLOWED_ATTR = ['src', 'alt', 'href', 'target', 'rel', 'class']

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR })
}

/** 캐러셀 등 — 위지윅 HTML을 태그 없는 미리보기 문장으로 (카드에 `<p>` 노출 방지) */
export function htmlToPlainTextPreview(html: string): string {
  const safe = sanitizeHtml(html)
  return safe
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/h[1-4]>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/section>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n')
    .replace(/<\/li>/gi, ' ')
    .replace(/<\/tr>/gi, '\n')
    .replace(/<\/td>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
