import { useCardsData } from './useCardsData'

describe('useCardsData', () => {
  it('데이터 5장을 반환한다', () => {
    const result = useCardsData()
    expect(result.data).toHaveLength(5)
  })

  it('loading은 false다', () => {
    const result = useCardsData()
    expect(result.loading).toBe(false)
  })

  it('error는 null이다', () => {
    const result = useCardsData()
    expect(result.error).toBeNull()
  })

  it('카드 순서가 올바르다 (intro → developer → career → projects → topic)', () => {
    const result = useCardsData()
    const types = result.data.map((c) => c.type)
    expect(types).toEqual(['intro', 'developer', 'career', 'projects', 'topic'])
  })

  it('각 카드에 keyword가 있다', () => {
    const result = useCardsData()
    result.data.forEach((card) => {
      expect(card.keyword).toBeTruthy()
    })
  })

  it('displayOrder가 0~4 순서로 정렬되어 있다', () => {
    const result = useCardsData()
    result.data.forEach((card, i) => {
      expect(card.displayOrder).toBe(i)
    })
  })
})
