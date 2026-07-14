import { renderSlot } from 'vue'
import { HeaderCell, SortIcon } from '../components'
// import ColumnResizer from '../table-column-resizer'
import { Alignment, SortOrder, oppositeOrderMap } from '../constants'
import { placeholderSign, rowDeleteColumnKey } from '../private'
import { componentToSlot, enforceUnit, tryCall } from '../utils'

import type { FunctionalComponent, UnwrapNestedRefs } from 'vue'
import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { TableV2HeaderRowCellRendererParams } from '../components'
import type { UseTableReturn } from '../use-table'
import type { ColumnInsertParams, TableV2Props } from '../table'

type ColumnTriggerState = Omit<ColumnInsertParams<any>, 'event'> & {
  left: number
}

export type HeaderCellRendererProps = TableV2HeaderRowCellRendererParams &
  UnwrapNestedRefs<
    Pick<
      UseTableReturn,
      'onColumnSorted' | 'updateColumnWidth' | 'visibleColumns'
    >
  > &
  Pick<
    TableV2Props,
    | 'sortBy'
    | 'sortState'
    | 'headerCellProps'
    | 'canEditTable'
    | 'editable'
    | 'editTable'
    | 'ghostTable'
    | 'showAddColumnTrigger'
    | 'addColumnButton'
  > & {
    onAddColumnTriggerChange?: (payload: ColumnTriggerState | null) => void
    onTailAddColumn?: (payload: ColumnInsertParams<any>) => void
    onHeaderDragend?: (
      newWidth: number,
      oldWidth: number,
      column: TableV2HeaderRowCellRendererParams['column'],
      event: MouseEvent
    ) => void
    ns: UseNamespaceReturn
  }

const HeaderCellRenderer: FunctionalComponent<HeaderCellRendererProps> = (
  props,
  { slots }
) => {
  const {
    column,
    ns,
    style,
    onColumnSorted,
    updateColumnWidth,
    visibleColumns,
    canEditTable,
    editable,
    editTable,
    ghostTable,
    showAddColumnTrigger,
    onAddColumnTriggerChange,
    onHeaderDragend,
  } = props

  const cellStyle = enforceUnit(style)

  if (column.placeholderSign === placeholderSign) {
    return (
      <div class={ns.em('header-row-cell', 'placeholder')} style={cellStyle} />
    )
  }

  const { diagonalHeader, headerCellRenderer, headerClass, sortable } = column

  /**
   * render Cell children
   */

  const cellProps = {
    ...props,
    class: ns.e('header-cell-text'),
  }

  const columnCellRenderer =
    componentToSlot<typeof cellProps>(headerCellRenderer)

  const diagonalHeaderContent = diagonalHeader ? (
    <div class={[ns.e('diagonal-header'), ns.e('header-cell-text')]}>
      <span class={ns.e('diagonal-header-text')}>{diagonalHeader.from}</span>
      <span class={ns.e('diagonal-header-text')}>{diagonalHeader.to}</span>
    </div>
  ) : null

  const Cell = columnCellRenderer
    ? columnCellRenderer(cellProps)
    : renderSlot(slots, 'default', cellProps, () => [
        diagonalHeaderContent ?? <HeaderCell {...cellProps} />,
      ])

  /**
   * Render cell container and sort indicator
   */
  const { sortBy, sortState, headerCellProps } = props

  let sorting: boolean, sortOrder: SortOrder
  if (sortState) {
    const order = sortState[column.key!]
    sorting = Boolean(oppositeOrderMap[order])
    sortOrder = sorting ? order : SortOrder.ASC
  } else {
    sorting = column.key === sortBy.key
    sortOrder = sorting ? sortBy.order : SortOrder.ASC
  }

  const cellKls = [
    ns.e('header-cell'),
    diagonalHeader && ns.is('diagonal-header'),
    column.required && 'required-column',
    tryCall(headerClass, props, ''),
    column.align === Alignment.CENTER && ns.is('align-center'),
    column.align === Alignment.RIGHT && ns.is('align-right'),
    sortable && ns.is('sortable'),
  ]

  const clearAddColumnTrigger = () => {
    onAddColumnTriggerChange?.(null)
  }

  const getVisibleColumnIndex = () =>
    visibleColumns.findIndex((item) => item.key === column.key)

  const emitAddColumnTrigger = (
    insertIndex: number,
    left: number,
    columnIndex = getVisibleColumnIndex()
  ) => {
    if (columnIndex < 0) {
      clearAddColumnTrigger()
      return
    }

    onAddColumnTriggerChange?.({
      column,
      columnIndex,
      insertIndex,
      left,
    })
  }

  const getColumnWidth = () => Number(column.width) || 0
  const getMinWidth = () =>
    Number(column.minWidth) > 0 ? Number(column.minWidth) : 88
  const getMaxWidth = () =>
    Number(column.maxWidth) > 0
      ? Number(column.maxWidth)
      : Number.POSITIVE_INFINITY

  const handleResizeMouseDown = (event: MouseEvent) => {
    if (event.button !== 0 || column.resizable === false) return

    event.preventDefault()
    event.stopPropagation()

    const startX = event.clientX
    const oldWidth = getColumnWidth()
    const minWidth = getMinWidth()
    const maxWidth = getMaxWidth()
    const previousCursor = document.body.style.cursor
    const previousUserSelect = document.body.style.userSelect

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const nextWidth = Math.min(
        maxWidth,
        Math.max(minWidth, oldWidth + deltaX)
      )

      updateColumnWidth(column, nextWidth)
    }

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = previousCursor
      document.body.style.userSelect = previousUserSelect

      onHeaderDragend?.(getColumnWidth(), oldWidth, column, upEvent)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleHeaderMouseMove = (event: MouseEvent) => {
    const canUseAddColumnTrigger = ghostTable
      ? editTable
      : canEditTable && editable

    if (
      !showAddColumnTrigger ||
      !canUseAddColumnTrigger ||
      column.placeholderSign === placeholderSign
    ) {
      clearAddColumnTrigger()
      return
    }

    const currentTarget = event.currentTarget as HTMLElement | null
    const root = currentTarget?.closest(`.${ns.b()}`) as HTMLElement | null
    if (!currentTarget || !root) {
      clearAddColumnTrigger()
      return
    }

    if (column.key === rowDeleteColumnKey) {
      clearAddColumnTrigger()
      return
    }

    const rect = currentTarget.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()
    const columnIndex = getVisibleColumnIndex()
    if (columnIndex < 0 || rect.width <= 8) {
      clearAddColumnTrigger()
      return
    }

    const isLeftHalf = event.clientX < rect.left + rect.width / 2
    const disableInsertBeforeFirstColumn =
      columnIndex === 0 &&
      isLeftHalf &&
      column.allowInsertBeforeFirstColumn === false

    if (disableInsertBeforeFirstColumn) {
      clearAddColumnTrigger()
      return
    }

    emitAddColumnTrigger(
      isLeftHalf ? columnIndex : columnIndex + 1,
      isLeftHalf ? rect.left - rootRect.left : rect.right - rootRect.left,
      columnIndex
    )
  }

  const handleHeaderMouseOut = (event: MouseEvent) => {
    const currentTarget = event.currentTarget as HTMLElement | null
    const relatedTarget = event.relatedTarget as Node | null
    const triggerSelector = `.${ns.e('add-column-trigger')}`

    if (
      currentTarget &&
      relatedTarget &&
      currentTarget.contains(relatedTarget)
    ) {
      return
    }

    if (
      relatedTarget instanceof HTMLElement &&
      relatedTarget.closest(triggerSelector)
    ) {
      return
    }

    clearAddColumnTrigger()
  }

  const cellWrapperProps = {
    ...tryCall(headerCellProps, props),
    onClick: column.sortable ? onColumnSorted : undefined,
    onMousemove: handleHeaderMouseMove,
    onMouseout: handleHeaderMouseOut,
    class: cellKls,
    style: cellStyle,
    ['data-key']: column.key,
  }

  // For now we don't deliver resizable column feature since it has some UX issue.
  return (
    <div {...cellWrapperProps} role="columnheader">
      {Cell}

      {sortable && (
        <SortIcon
          class={[ns.e('sort-icon'), sorting && ns.is('sorting')]}
          sortOrder={sortOrder}
          sorting={sorting}
        />
      )}

      {column.resizable !== false && (
        <div
          class={ns.e('column-resizer')}
          onClick={(event: MouseEvent) => event.stopPropagation()}
          onMousedown={handleResizeMouseDown}
        />
      )}
    </div>
  )
}

export default HeaderCellRenderer
export type HeaderCellSlotProps = HeaderCellRendererProps & { class: string }
