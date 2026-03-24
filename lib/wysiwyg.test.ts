import { htmlToPlainTextPreview, sanitizeHtml } from './wysiwyg'

describe('sanitizeHtml', () => {
  it('script 태그를 제거한다', () => {
    expect(sanitizeHtml('<script>alert(1)</script><p>hello</p>')).toBe('<p>hello</p>')
  })

  it('허용된 태그(p, strong, em)를 유지한다', () => {
    const input = '<p><strong>굵게</strong> <em>기울임</em></p>'
    expect(sanitizeHtml(input)).toBe(input)
  })

  it('허용된 태그(ul, ol, li)를 유지한다', () => {
    const input = '<ul><li>항목 1</li><li>항목 2</li></ul>'
    expect(sanitizeHtml(input)).toBe(input)
  })

  it('허용된 태그(img)와 src, alt 속성을 유지한다', () => {
    const input = '<img src="https://example.com/img.png" alt="설명">'
    expect(sanitizeHtml(input)).toContain('src="https://example.com/img.png"')
    expect(sanitizeHtml(input)).toContain('alt="설명"')
  })

  it('허용된 태그(a)와 href 속성을 유지한다', () => {
    const input = '<a href="https://example.com" target="_blank" rel="noopener">링크</a>'
    expect(sanitizeHtml(input)).toBe(input)
  })

  it('허용되지 않는 태그(iframe)를 제거한다', () => {
    const result = sanitizeHtml('<iframe src="https://evil.com"></iframe><p>안전</p>')
    expect(result).not.toContain('iframe')
    expect(result).toContain('<p>안전</p>')
  })

  it('허용되지 않는 태그(style)를 제거한다', () => {
    const result = sanitizeHtml('<style>body{display:none}</style><p>텍스트</p>')
    expect(result).not.toContain('style')
    expect(result).toContain('<p>텍스트</p>')
  })

  it('onclick 등 이벤트 속성을 제거한다', () => {
    const result = sanitizeHtml('<p onclick="alert(1)">클릭</p>')
    expect(result).not.toContain('onclick')
    expect(result).toContain('<p>')
    expect(result).toContain('클릭')
  })

  it('onerror 속성을 제거한다', () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">')
    expect(result).not.toContain('onerror')
  })

  it('허용되지 않는 속성(style 인라인)을 제거한다', () => {
    const result = sanitizeHtml('<p style="color:red">텍스트</p>')
    expect(result).not.toContain('style=')
    expect(result).toContain('텍스트')
  })

  it('빈 문자열 입력 시 빈 문자열을 반환한다', () => {
    expect(sanitizeHtml('')).toBe('')
  })

  it('h1~h4 태그를 유지한다', () => {
    const input = '<h1>제목1</h1><h2>제목2</h2><h3>제목3</h3><h4>제목4</h4>'
    expect(sanitizeHtml(input)).toBe(input)
  })

  it('blockquote, code, pre 태그를 유지한다', () => {
    const input = '<blockquote><p>인용</p></blockquote><pre><code>코드</code></pre>'
    expect(sanitizeHtml(input)).toBe(input)
  })

  it('XSS javascript: 링크를 제거한다', () => {
    const result = sanitizeHtml('<a href="javascript:alert(1)">링크</a>')
    expect(result).not.toContain('javascript:')
  })

  it('htmlToPlainTextPreview는 태그를 제거하고 문장만 남긴다', () => {
    const html = '<p><strong>안녕</strong>하세요</p><p>두 번째</p>'
    expect(htmlToPlainTextPreview(html)).toBe('안녕하세요 두 번째')
  })

  it('section, hr, table 구조를 유지한다', () => {
    const input =
      '<section><h2>제목</h2><hr /><table><thead><tr><th>a</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table></section>'
    const expected =
      '<section><h2>제목</h2><hr><table><thead><tr><th>a</th></tr></thead><tbody><tr><td>b</td></tr></tbody></table></section>'
    expect(sanitizeHtml(input)).toBe(expected)
  })
})
