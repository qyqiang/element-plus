import { getCurrentInstance, inject, ref } from 'vue'
import {
  createTablePopper,
  getColumnByCell,
  getPadding,
  getThCell,
  isGreaterThan,
  removePopper,
  toggleRowClassByCell,
} from '@element-plus/components/table/src/util'
import { isNull } from 'lodash-unified'
import {
  addClass,
  hasClass,
  isClient,
  isElement,
  removeClass,
} from '@element-plus/utils'
import { TABLE_INJECTION_KEY } from '../tokens'

import type { EmitFn } from '@element-plus/utils'
import type { TableHeaderProps } from '.'
import type { TableColumnCtx } from '../table-column/defaults'
import type { DefaultRow, TableSortOrder } from '../table/defaults'

function useEvent<T extends DefaultRow>(
  props: TableHeaderProps<T>,
  emit: EmitFn<string[]>
) {
  const instance = getCurrentInstance()
  const parent = inject(TABLE_INJECTION_KEY)

  const handleCellMouseEnter = (event: MouseEvent, row: T) => {
    if (!parent) return
    const table = parent
    const cell = getThCell(event)
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
      if (!column) return
      if (cell.rowSpan > 1) {
        toggleRowClassByCell(cell.rowSpan, event, addClass)
      }
    }
    // show the tooltip only when text overflow is detected
    const cellChild = (event.target as HTMLElement).querySelector(
      column?.sortable ? '.cell-span' : '.cell'
    ) as HTMLElement
    if (!cellChild.childNodes.length) return
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
    const limitWidth = rangeWidth + horizontalPadding
    if (
      isGreaterThan(limitWidth, cellChildWidth) ||
      isGreaterThan(rangeHeight + verticalPadding, cellChildHeight) ||
      // When using a high-resolution screen, it is possible that a returns cellChild.scrollWidth value of 1921 and
      // cellChildWidth returns a value of 1920.994140625. #16856 #16673
      isGreaterThan(cellChild.scrollWidth, cellChildWidth)
    ) {
      createTablePopper(
        { effect: 'light' },
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

  const handleFilterClick = (event: Event) => {
    event.stopPropagation()
    return
  }

  const handleHeaderClick = (event: Event, column: TableColumnCtx<T>) => {
    if (!column.filters && column.sortable) {
      // v3: disable title click event
      // handleSortClick(event, column, false)
    } else if (column.filterable && !column.sortable) {
      handleFilterClick(event)
    }
    parent?.emit('header-click', column, event)
  }

  const handleHeaderContextMenu = (event: Event, column: TableColumnCtx<T>) => {
    parent?.emit('header-contextmenu', column, event)
  }
  const draggingColumn = ref<TableColumnCtx<T> | null>(null)
  const dragging = ref(false)
  const dragState = ref<{
    startMouseLeft: number
    startLeft: number
    startColumnLeft: number
    tableLeft: number
  }>()
  const clearAddColumnTrigger = () => {
    emit('update-add-column-trigger', null)
  }
  const isColumnBeforeLastRightFixedColumn = (column: TableColumnCtx<T>) => {
    const rightFixedLeafColumnsLength =
      props.store.states.rightFixedLeafColumnsLength.value
    if (rightFixedLeafColumnsLength <= 0) {
      return false
    }

    const columns = props.store.states.columns.value
    const columnIndex = columns.findIndex((item) => item.id === column.id)
    if (columnIndex < 0) {
      return false
    }

    let lastRightFixedIndex = -1
    for (let index = columns.length - 1; index >= 0; index--) {
      if (columns[index].fixed === 'right') {
        lastRightFixedIndex = index
        break
      }
    }

    if (lastRightFixedIndex <= 0) {
      return false
    }

    return columnIndex === lastRightFixedIndex - 1
  }
  const handleMouseDown = (event: MouseEvent, column: TableColumnCtx<T>) => {
    if (!isClient || !column.resizable) return
    if (column.children && column.children.length > 0) return
    if (isColumnBeforeLastRightFixedColumn(column)) return
    /* istanbul ignore if */
    if (draggingColumn.value && props.border) {
      clearAddColumnTrigger()
      dragging.value = true

      const table = parent
      emit('set-drag-visible', true)
      const tableEl = table?.vnode.el
      const tableLeft = tableEl?.getBoundingClientRect().left
      const columnEl = instance?.vnode?.el?.querySelector(`th.${column.id}`)
      const columnRect = columnEl.getBoundingClientRect()
      const minLeft = columnRect.left - tableLeft + 88

      addClass(columnEl, 'noclick')

      dragState.value = {
        startMouseLeft: event.clientX,
        startLeft: columnRect.right - tableLeft,
        startColumnLeft: columnRect.left - tableLeft,
        tableLeft,
      }
      const resizeProxy = table?.refs.resizeProxy as HTMLElement
      resizeProxy.style.left = `${(dragState.value as any).startLeft}px`

      document.onselectstart = function () {
        return false
      }
      document.ondragstart = function () {
        return false
      }

      const handleMouseMove = (event: MouseEvent) => {
        const deltaLeft =
          event.clientX - (dragState.value as any).startMouseLeft
        const proxyLeft = (dragState.value as any).startLeft + deltaLeft

        resizeProxy.style.left = `${Math.max(minLeft, proxyLeft)}px`
      }

      const handleMouseUp = () => {
        if (dragging.value) {
          const { startColumnLeft, startLeft } = dragState.value as any
          const finalLeft = Number.parseInt(resizeProxy.style.left, 10)
          const columnWidth = finalLeft - startColumnLeft
          column.width = column.realWidth = columnWidth
          table?.emit(
            'header-dragend',
            column.width,
            startLeft - startColumnLeft,
            column,
            event
          )
          requestAnimationFrame(() => {
            props.store.scheduleLayout(false, true)
          })
          document.body.style.cursor = ''
          dragging.value = false
          draggingColumn.value = null
          dragState.value = undefined
          emit('set-drag-visible', false)
        }

        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
        document.onselectstart = null
        document.ondragstart = null

        setTimeout(() => {
          removeClass(columnEl, 'noclick')
        }, 0)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }
  }

  const handleMouseMove = (event: MouseEvent, column: TableColumnCtx<T>) => {
    if (column.children && column.children.length > 0) return
    const el = event.target as HTMLElement
    if (!isElement(el)) {
      return
    }
    const target = el?.closest('th')

    if (!column || !column.resizable || !target) return

    if (!dragging.value && props.border) {
      const rect = target.getBoundingClientRect()
      const tableRect = parent?.vnode.el?.getBoundingClientRect()

      const bodyStyle = document.body.style
      const isLastTh = target.parentNode?.lastElementChild === target
      const allowDarg =
        !isColumnBeforeLastRightFixedColumn(column) &&
        (props.allowDragLastColumn || !isLastTh)
      if (rect.width > 12 && rect.right - event.clientX < 8 && allowDarg) {
        bodyStyle.cursor = 'col-resize'
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'col-resize'
        }
        draggingColumn.value = column as any
        if (props.showAddColumnTrigger && tableRect) {
          const columnIndex = props.store.states.columns.value.findIndex(
            (item) => item.id === column.id
          )
          if (columnIndex > -1) {
            emit('update-add-column-trigger', {
              column,
              columnIndex,
              insertIndex: columnIndex + 1,
              left: rect.right - tableRect.left,
              top: rect.top - tableRect.top + rect.height / 2,
            })
          }
        } else {
          clearAddColumnTrigger()
        }
      } else if (!dragging.value) {
        bodyStyle.cursor = ''
        if (hasClass(target, 'is-sortable')) {
          target.style.cursor = 'pointer'
        }
        draggingColumn.value = null
        clearAddColumnTrigger()
      }
    }
  }

  const handleMouseOut = (event: MouseEvent) => {
    if (!isClient) return
    const currentTarget = event.currentTarget as HTMLElement | null
    const relatedTarget = event.relatedTarget as Node | null
    const namespace = parent?.vnode.el?.dataset.prefix ?? 'el'
    const triggerSelector = `.${namespace}-table__add-column-trigger`
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
    document.body.style.cursor = ''
    clearAddColumnTrigger()
  }
  const toggleOrder = ({ order, sortOrders }: TableColumnCtx<T>) => {
    if ((order as string) === '') return sortOrders[0]
    const index = sortOrders.indexOf(order || null)
    return sortOrders[index > sortOrders.length - 2 ? 0 : index + 1]
  }
  const handleSortClick = (
    event: Event,
    column: TableColumnCtx<T>,
    givenOrder?: TableSortOrder | boolean
  ) => {
    event.stopPropagation()
    const order = (
      column.order === givenOrder ? null : givenOrder || toggleOrder(column)
    ) as TableSortOrder | null
    const target = (event.target as HTMLElement)?.closest('th')

    if (target) {
      if (hasClass(target, 'noclick')) {
        removeClass(target, 'noclick')
        return
      }
    }

    if (!column.sortable) return

    const clickTarget = event.currentTarget

    if (
      ['ascending', 'descending'].some(
        (str) =>
          hasClass(clickTarget as Element, str) &&
          !column.sortOrders.includes(str as TableSortOrder)
      )
    ) {
      return
    }

    const states = props.store.states
    let sortProp = states.sortProp.value
    let sortOrder
    const sortingColumn = states.sortingColumn.value

    if (
      sortingColumn !== column ||
      (sortingColumn === column && isNull(sortingColumn.order))
    ) {
      if (sortingColumn) {
        sortingColumn.order = null
      }
      states.sortingColumn.value = column
      sortProp = column.property
    }
    if (!order) {
      sortOrder = column.order = null
    } else {
      sortOrder = column.order = order
    }

    states.sortProp.value = sortProp
    states.sortOrder.value = sortOrder

    parent?.store.commit('changeSortCondition')
  }

  return {
    handleCellMouseEnter,
    handleHeaderClick,
    handleHeaderContextMenu,
    handleMouseDown,
    handleMouseMove,
    handleMouseOut,
    handleSortClick,
    handleFilterClick,
  }
}

export default useEvent
