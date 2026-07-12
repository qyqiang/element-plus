import { h, inject, nextTick, ref } from 'vue'
import { debounce } from 'lodash-unified'
import { addClass, hasClass, isElement, removeClass } from '@element-plus/utils'
import {
  createTablePopper,
  getCell,
  getColumnByCell,
  getPadding,
  isGreaterThan,
  removePopper,
  toggleRowClassByCell,
} from '../util'
import { ghostRowSign } from '../private'
import { TABLE_INJECTION_KEY } from '../tokens'

import type { TableColumnCtx } from '../table-column/defaults'
import type { TableBodyProps } from './defaults'
import type { TableOverflowTooltipOptions } from '../util'
import type { DefaultRow } from '../table/defaults'

function useEvents<T extends DefaultRow>(
  props: Partial<TableBodyProps<T>>,
  emit: (...args: any[]) => void
) {
  const parent = inject(TABLE_INJECTION_KEY)
  const tooltipContent = ref('')
  const tooltipTrigger = ref(h('div'))
  const clearAddRowTrigger = () => {
    emit('update-add-row-trigger', null)
  }
  const isRowEditLocked = (row?: T) => {
    const editingRow = parent?.editingRow?.value
    return parent?.props.editable && !!editingRow && editingRow.row !== row
  }
  const handleEvent = (event: Event, row: T, name: string) => {
    const table = parent
    const cell = getCell(event)
    let column: TableColumnCtx<T> | null = null
    const namespace = table?.vnode.el?.dataset.prefix
    if (cell) {
      column = getColumnByCell(
        {
          columns: props.store?.states.columns.value ?? [],
        },
        cell,
        namespace
      )
      if (column) {
        table?.emit(`cell-${name}`, row, column, cell, event)
      }
    }
    table?.emit(`row-${name}`, row, column, event)
  }
  const handleDoubleClick = (event: Event, row: T) => {
    if (isRowEditLocked(row)) return
    handleEvent(event, row, 'dblclick')
  }
  const handleCellClick = (
    event: Event,
    row: T,
    column: TableColumnCtx<T>,
    rowIndex: number,
    cellIndex: number
  ) => {
    if (isRowEditLocked(row) || !parent?.props.editable) return
    if (parent?.editingRow?.value?.row === row) return
    const cell = getCell(event)
    const editableCell = cell?.querySelector<HTMLElement>(
      '.editable-table-cell'
    )
    if (cell && column && editableCell) {
      parent.startRowEdit?.(row, column.property, rowIndex, cellIndex)
      nextTick(() => {
        editableCell.dispatchEvent(
          new CustomEvent('editable-cell-focus', {
            bubbles: false,
          })
        )
      })
    }
  }
  const handleClick = (event: Event, row: T) => {
    if (isRowEditLocked(row)) return
    props.store?.commit('setCurrentRow', row)
    handleEvent(event, row, 'click')
  }
  const handleContextMenu = (event: Event, row: T) => {
    if (isRowEditLocked(row)) return
    handleEvent(event, row, 'contextmenu')
  }
  const handleMouseEnter = debounce((index: number) => {
    const row = props.store?.states.data.value?.[index]
    if (row && isRowEditLocked(row)) {
      props.store?.commit('setHoverRow', null)
      return
    }
    props.store?.commit('setHoverRow', index)
  }, 30)
  const handleMouseLeave = debounce(() => {
    props.store?.commit('setHoverRow', null)
  }, 30)
  const handleRowMouseMove = (event: MouseEvent, row: T, rowIndex: number) => {
    if (
      !parent?.props.showAddRowTrigger ||
      !parent?.props.editTable ||
      !parent?.props.border
    ) {
      clearAddRowTrigger()
      return
    }
    const currentTarget = event.currentTarget as HTMLElement | null
    const tableRect = parent?.vnode.el?.getBoundingClientRect()
    if (!currentTarget || !tableRect) return
    const rect = currentTarget.getBoundingClientRect()
    const nearTop = rect.height > 12 && event.clientY - rect.top < 8
    const nearBottom = rect.height > 12 && rect.bottom - event.clientY < 8
    const isGhostRow = Boolean(row?.[ghostRowSign])
    if (nearTop) {
      emit('update-add-row-trigger', {
        row,
        rowIndex,
        insertIndex: rowIndex,
        top: rect.top - tableRect.top,
        placement: 'below',
      })
    } else if (nearBottom && !isGhostRow) {
      emit('update-add-row-trigger', {
        row,
        rowIndex,
        insertIndex: rowIndex + 1,
        top: rect.bottom - tableRect.top,
        placement: 'above',
      })
    } else {
      clearAddRowTrigger()
    }
  }
  const handleRowMouseOut = (event: MouseEvent) => {
    const currentTarget = event.currentTarget as HTMLElement | null
    const relatedTarget = event.relatedTarget as Node | null
    const namespace = parent?.vnode.el?.dataset.prefix ?? 'el'
    const triggerSelector = `.${namespace}-table__add-row-trigger`
    if (
      currentTarget &&
      relatedTarget &&
      currentTarget.contains(relatedTarget)
    ) {
      return
    }
    if (isElement(relatedTarget) && relatedTarget.closest(triggerSelector)) {
      return
    }
    clearAddRowTrigger()
  }

  const handleCellMouseEnter = (
    event: MouseEvent,
    row: T,
    tooltipOptions: TableOverflowTooltipOptions
  ) => {
    if (!parent) return
    if (isRowEditLocked(row)) return
    const table = parent
    const cell = getCell(event)
    const namespace = table?.vnode.el?.dataset.prefix
    let column: TableColumnCtx<T> | null = null
    if (cell) {
      column = getColumnByCell(
        {
          columns: props.store?.states.columns.value ?? [],
        },
        cell,
        namespace
      )
      if (!column) {
        return
      }
      if (cell.rowSpan > 1) {
        toggleRowClassByCell(cell.rowSpan, event, addClass)
      }
      addClass(event.target as Element, 'cell-hover')
      const hoverState = (table.hoverState = {
        cell,
        column: column as any,
        row,
      })
      table?.emit(
        'cell-mouse-enter',
        hoverState.row,
        hoverState.column,
        hoverState.cell,
        event
      )
    }

    if (!tooltipOptions) {
      if (removePopper?.trigger === cell) {
        removePopper?.()
      }
      return
    }

    // show the tooltip only when text overflow is detected
    const cellChild = (event.target as HTMLElement).querySelector(
      '.cell'
    ) as HTMLElement
    if (
      !(
        hasClass(cellChild, `${namespace}-tooltip`) &&
        cellChild.childNodes.length
      )
    ) {
      return
    }
    // use range width instead of scrollWidth to determine whether the text is overflowing
    // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
    const range = document.createRange()
    range.setStart(cellChild, 0)
    range.setEnd(cellChild, cellChild.childNodes.length)
    /** detail: https://github.com/element-plus/element-plus/issues/10790
     *  What went wrong?
     *  UI > Browser > Zoom, In Blink/WebKit, getBoundingClientRect() sometimes returns inexact values, probably due to lost precision during internal calculations. In the example above:
     *    - Expected: 188
     *    - Actual: 188.00000762939453
     */
    const { width: rangeWidth, height: rangeHeight } =
      range.getBoundingClientRect()
    const { width: cellChildWidth, height: cellChildHeight } =
      cellChild.getBoundingClientRect()

    const { top, left, right, bottom } = getPadding(cellChild)
    const horizontalPadding = left + right
    const verticalPadding = top + bottom
    if (
      isGreaterThan(rangeWidth + horizontalPadding, cellChildWidth) ||
      isGreaterThan(rangeHeight + verticalPadding, cellChildHeight) ||
      // When using a high-resolution screen, it is possible that a returns cellChild.scrollWidth value of 1921 and
      // cellChildWidth returns a value of 1920.994140625. #16856 #16673
      isGreaterThan(cellChild.scrollWidth, cellChildWidth)
    ) {
      createTablePopper(
        tooltipOptions,
        (cell?.innerText || cell?.textContent) ?? '',
        row,
        column,
        cell,
        table
      )
    } else if (removePopper?.trigger === cell) {
      removePopper?.()
    }
  }
  const handleCellMouseLeave = (event: MouseEvent) => {
    const cell = getCell(event)
    if (!cell) return
    if (cell.rowSpan > 1) {
      toggleRowClassByCell(cell.rowSpan, event, removeClass)
    }
    removeClass(event.target as Element, 'cell-hover')
    const oldHoverState = parent?.hoverState
    parent?.emit(
      'cell-mouse-leave',
      oldHoverState?.row,
      oldHoverState?.column,
      oldHoverState?.cell,
      event
    )
  }

  return {
    handleDoubleClick,
    handleClick,
    handleCellClick,
    handleContextMenu,
    handleMouseEnter,
    handleMouseLeave,
    handleRowMouseMove,
    handleRowMouseOut,
    handleCellMouseEnter,
    handleCellMouseLeave,
    tooltipContent,
    tooltipTrigger,
  }
}

export default useEvents
