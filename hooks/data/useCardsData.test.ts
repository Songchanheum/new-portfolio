import { renderHook, waitFor } from '@testing-library/react'

import { useCardsData } from './useCardsData'

const mockRows = [
  { id: 'card-0', type: 'intro', keyword: 'k0', detail: 'd0', display_order: 0 },
  { id: 'card-1', type: 'developer', keyword: 'k1', detail: 'd1', display_order: 1 },
  { id: 'card-2', type: 'career', keyword: 'k2', detail: 'd2', display_order: 2 },
  { id: 'card-3', type: 'projects', keyword: 'k3', detail: 'd3', display_order: 3 },
  { id: 'card-4', type: 'topic', keyword: 'k4', detail: 'd4', display_order: 4 },
]

jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        order: jest.fn(() => Promise.resolve({ data: mockRows, error: null })),
      })),
    })),
  },
}))

describe('useCardsData', () => {
  it('초기에는 빈 배열이고 loading이다', () => {
    const { result } = renderHook(() => useCardsData())
    expect(result.current.data).toEqual([])
    expect(result.current.loading).toBe(true)
  })

  it('조회 후 Supabase 행이 매핑된다', async () => {
    const { result } = renderHook(() => useCardsData())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.data).toHaveLength(5)
    expect(result.current.data[0]).toEqual({
      id: 'card-0',
      type: 'intro',
      keyword: 'k0',
      detail: 'd0',
      displayOrder: 0,
    })
    const types = result.current.data.map((c) => c.type)
    expect(types).toEqual(['intro', 'developer', 'career', 'projects', 'topic'])
  })
})
