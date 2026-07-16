import { describe, expect, it } from 'vitest'
import { getAutoColumnWidth } from '../src/column-width'

describe('Table automatic column width', () => {
  it('uses 80px as the minimum automatic width', () => {
    expect(getAutoColumnWidth('')).toBe(80)
    expect(getAutoColumnWidth('ID')).toBe(80)
  })

  it('adds 48px to header text wider than the minimum', () => {
    expect(getAutoColumnWidth('Description')).toBe(136)
  })
})
