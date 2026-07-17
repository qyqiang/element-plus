import { describe, expect, it } from 'vitest'
import { selectProps } from '../src/select'

describe('Select props', () => {
  it('is filterable by default', () => {
    expect(selectProps.filterable.default).toBe(true)
  })
})
