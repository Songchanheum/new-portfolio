'use client'

export default function PDFDownloadButton() {
  function handlePrint() {
    const year = new Date().getFullYear()
    const prev = document.title
    document.title = `송찬흠_이력서_${year}`
    window.print()
    document.title = prev
  }

  return (
    <button
      onClick={handlePrint}
      className="no-print inline-flex items-center gap-2 px-4 py-2 text-sm border border-[#1a5c38] text-[#1a5c38] hover:bg-[#1a5c38] hover:text-white transition-colors"
    >
      PDF 다운로드
    </button>
  )
}
