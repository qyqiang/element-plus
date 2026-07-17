import { describe, expect, it } from 'vitest'
import { selectV2Props } from '../src/defaults'

describe('Select V2 props', () => {
  it('is filterable by default', () => {
    expect(selectV2Props.filterable.default).toBe(true)
  })
})
