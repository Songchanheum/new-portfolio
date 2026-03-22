import { renderHook, act } from '@testing-library/react'

import { usePortfolioState } from './usePortfolioState'

describe('usePortfolioState', () => {
  it('초기값: currentCardIndex=0, activeLayer=null, isChatbotOpen=false', () => {
    const { result } = renderHook(() => usePortfolioState())
    expect(result.current.currentCardIndex).toBe(0)
    expect(result.current.activeLayer).toBeNull()
    expect(result.current.isChatbotOpen).toBe(false)
  })

  it('setCurrentCardIndex로 인덱스를 변경한다', () => {
    const { result } = renderHook(() => usePortfolioState())
    act(() => {
      result.current.setCurrentCardIndex(3)
    })
    expect(result.current.currentCardIndex).toBe(3)
  })

  it('setActiveLayer로 레이어를 열고 닫는다', () => {
    const { result } = renderHook(() => usePortfolioState())
    act(() => {
      result.current.setActiveLayer('career')
    })
    expect(result.current.activeLayer).toBe('career')
    act(() => {
      result.current.setActiveLayer(null)
    })
    expect(result.current.activeLayer).toBeNull()
  })

  it('toggleChatbot으로 챗봇 상태를 토글한다', () => {
    const { result } = renderHook(() => usePortfolioState())
    act(() => {
      result.current.toggleChatbot()
    })
    expect(result.current.isChatbotOpen).toBe(true)
    act(() => {
      result.current.toggleChatbot()
    })
    expect(result.current.isChatbotOpen).toBe(false)
  })

  it('isLayerOpen은 activeLayer !== null로 판단한다 (별도 변수 없음)', () => {
    const { result } = renderHook(() => usePortfolioState())
    // activeLayer가 null이면 레이어 닫힘
    expect(result.current.activeLayer !== null).toBe(false)
    act(() => {
      result.current.setActiveLayer('projects')
    })
    // activeLayer가 'projects'이면 레이어 열림
    expect(result.current.activeLayer !== null).toBe(true)
  })
})
