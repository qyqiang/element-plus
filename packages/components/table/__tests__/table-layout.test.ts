import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import TableLayout from '../src/table-layout'

import type { TableColumnCtx } from '../src/table-column/defaults'

describe('TableLayout automatic column width', () => {
  it('assigns all remaining width to the last widthless column', () => {
    const columns = [
      { minWidth: 80 },
      { minWidth: 96 },
      { minWidth: 136 },
    ] as TableColumnCtx<any>[]
    const tableElement = document.createElement('div')
    Object.defineProperty(tableElement, 'clientWidth', { value: 700 })
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
    const layout = new TableLayout({ table, store, fit: true })

    layout.updateColumnsWidth()

    expect(columns.map(({ realWidth }) => realWidth)).toEqual([80, 96, 524])
    expect(layout.scrollX.value).toBe(false)
    expect(layout.bodyWidth.value).toBe(700)
  })

  it('keeps explicit widths and stretches only the last widthless column', () => {
    const columns = [
      { width: 120, minWidth: 80 },
      { minWidth: 80 },
      { width: 100, minWidth: 80 },
      { minWidth: 96 },
    ] as TableColumnCtx<any>[]
    const tableElement = document.createElement('div')
    Object.defineProperty(tableElement, 'clientWidth', { value: 500 })
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
    const layout = new TableLayout({ table, store, fit: true })

    layout.updateColumnsWidth()

    expect(columns.map(({ realWidth }) => realWidth)).toEqual([
      120, 80, 100, 200,
    ])
  })

  it('skips trailing fixed columns after all columns are resized', () => {
    const columns = [
      { width: 120, minWidth: 80 },
      { width: 100, minWidth: 80 },
      { width: 96, minWidth: 80, fixed: 'right' },
      { width: 84, minWidth: 80, fixed: 'right' },
    ] as TableColumnCtx<any>[]
    const tableElement = document.createElement('div')
    Object.defineProperty(tableElement, 'clientWidth', { value: 500 })
    const store = {
      states: {
        columns: ref(columns),
        fixedColumns: ref([]),
        rightFixedColumns: ref([columns[2], columns[3]]),
      },
    }
    const table = {
      vnode: { el: tableElement },
      refs: {},
      state: { resizeState: ref({ width: 0 }) },
      store,
    }
    const layout = new TableLayout({ table, store, fit: true })

    layout.updateColumnsWidth()

    expect(columns.map(({ width }) => width)).toEqual([120, 100, 96, 84])
    expect(columns.map(({ realWidth }) => realWidth)).toEqual([
      120, 200, 96, 84,
    ])
    expect(layout.scrollX.value).toBe(false)
    expect(layout.bodyWidth.value).toBe(500)
  })

  it('does not stretch a fixed widthless column', () => {
    const columns = [
      { minWidth: 80 },
      { minWidth: 96, fixed: 'right' },
    ] as TableColumnCtx<any>[]
    const tableElement = document.createElement('div')
    Object.defineProperty(tableElement, 'clientWidth', { value: 300 })
    const store = {
      states: {
        columns: ref(columns),
        fixedColumns: ref([]),
        rightFixedColumns: ref([columns[1]]),
      },
    }
    const table = {
      vnode: { el: tableElement },
      refs: {},
      state: { resizeState: ref({ width: 0 }) },
      store,
    }
    const layout = new TableLayout({ table, store, fit: true })

    layout.updateColumnsWidth()

    expect(columns.map(({ realWidth }) => realWidth)).toEqual([204, 96])
  })

  it('keeps automatic widths when they overflow the table', () => {
    const columns = [
      { minWidth: 80 },
      { minWidth: 96 },
      { minWidth: 136 },
    ] as TableColumnCtx<any>[]
    const tableElement = document.createElement('div')
    Object.defineProperty(tableElement, 'clientWidth', { value: 240 })
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
    const layout = new TableLayout({ table, store, fit: true })

    layout.updateColumnsWidth()

    expect(columns.map(({ realWidth }) => realWidth)).toEqual([80, 96, 136])
    expect(layout.scrollX.value).toBe(true)
    expect(layout.bodyWidth.value).toBe(312)
  })
})
