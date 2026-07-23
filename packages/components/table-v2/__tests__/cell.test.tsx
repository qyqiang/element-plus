import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import TableCell from '../src/components/cell'

describe('TableV2 cell overflow tooltip', () => {
  it('enables the tooltip only when the text overflows', async () => {
    const wrapper = mount(TableCell, {
      props: {
        cellData: 'A long cell value',
        class: 'el-table-v2__cell-text',
        showOverflowTooltip: true,
      },
    })
    const cell = wrapper.find('.el-table-v2__cell-text')
    const tooltip = wrapper.findComponent({ name: 'ElTooltip' })

    Object.defineProperties(cell.element, {
      clientHeight: { configurable: true, value: 20 },
      clientWidth: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 20 },
      scrollWidth: { configurable: true, value: 180 },
    })

    expect(tooltip.props('disabled')).toBe(true)
    await cell.trigger('mouseenter')
    await nextTick()

    expect(tooltip.props('disabled')).toBe(false)
    expect(tooltip.props('content')).toBe('A long cell value')

    Object.defineProperty(cell.element, 'scrollWidth', {
      configurable: true,
      value: 100,
    })
    await cell.trigger('mouseenter')
    await nextTick()

    expect(tooltip.props('disabled')).toBe(true)
  })

  it('passes tooltip options through to ElTooltip', () => {
    const wrapper = mount(TableCell, {
      props: {
        cellData: 'Cell value',
        showOverflowTooltip: {
          effect: 'dark',
          placement: 'right',
          showAfter: 300,
        },
      },
    })
    const tooltip = wrapper.findComponent({ name: 'ElTooltip' })

    expect(tooltip.props('effect')).toBe('dark')
    expect(tooltip.props('placement')).toBe('right')
    expect(tooltip.props('showAfter')).toBe(300)
  })
})
