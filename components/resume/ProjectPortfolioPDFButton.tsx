'use client'

export default function ProjectPortfolioPDFButton() {
  function handleOpen() {
    const year = new Date().getFullYear()
    const url = `/resume/print-projects?auto=1&y=${year}`
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) {
      window.alert(
        '팝업이 차단된 상태입니다. 브라우저에서 이 사이트의 팝업을 허용한 뒤 다시 눌러 주세요.'
      )
    }
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      className="no-print inline-flex items-center gap-2 px-4 py-2 text-sm border border-[#1a5c38] text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white transition-colors"
    >
      포트폴리오 PDF
    </button>
  )
}
