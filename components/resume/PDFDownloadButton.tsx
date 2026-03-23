'use client'

export default function PDFDownloadButton() {
  function handleOpenFullPrint() {
    const year = new Date().getFullYear()
    const url = `/resume/print?auto=1&y=${year}`
    const opened = window.open(url, '_blank', 'noopener,noreferrer')
    if (!opened) {
      window.location.href = url
    }
  }

  return (
    <button
      type="button"
      onClick={handleOpenFullPrint}
      className="no-print inline-flex items-center gap-2 px-4 py-2 text-sm border border-[#1a5c38] text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white transition-colors"
    >
      PDF 다운로드
    </button>
  )
}
