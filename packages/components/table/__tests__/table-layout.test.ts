import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import TableLayout from '../src/table-layout'

import type { TableColumnCtx } from '../src/table-column/defaults'

const createLayout = (columns: TableColumnCtx<any>[], width: number) => {
  const tableElement = document.createElement('div')
  Object.defineProperty(tableElement, 'clientWidth', { value: width })
  const store = {
    states: {
      columns: ref(columns),
      fixedColumns: ref([]),
      rightFixedColumns: ref([]),
    },
  }
  const table = {
    vnode: { el: tableElement },
    refs: {},
    state: { resizeState: ref({ width: 0 }) },
    store,
  }

  return new TableLayout({ table, store, fit: true })
}

describe('TableLayout column width', () => {
  it('distributes remaining width across all flexible columns', () => {
    const columns = [
      { minWidth: 80 },
      { minWidth: 80 },
      { minWidth: 80 },
    ] as TableColumnCtx<any>[]
    const layout = createLayout(columns, 700)

    layout.updateColumnsWidth()

    expect(columns.map(({ realWidth }) => realWidth)).toEqual([234, 233, 233])
    expect(layout.scrollX.value).toBe(false)
    expect(layout.bodyWidth.value).toBe(700)
  })

  it('keeps minimum widths when columns overflow the table', () => {
    const columns = [
      { minWidth: 80 },
      { minWidth: 96 },
      { minWidth: 136 },
    ] as TableColumnCtx<any>[]
    const layout = createLayout(columns, 240)

    layout.updateColumnsWidth()

    expect(columns.map(({ realWidth }) => realWidth)).toEqual([80, 96, 136])
    expect(layout.scrollX.value).toBe(true)
    expect(layout.bodyWidth.value).toBe(312)
  })
})
