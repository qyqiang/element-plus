import { Row } from '../components'
import { ghostRowSign, rowAddSign } from '../private'
import { tryCall } from '../utils'

import type {
  ComponentInternalInstance,
  FunctionalComponent,
  UnwrapNestedRefs,
} from 'vue'
import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { RowAddHandler } from '../row'
import type { UseTableReturn } from '../use-table'
import type { RowInsertParams, TableV2Props } from '../table'
import type { TableGridRowSlotParams } from '../table-grid'

type RowTriggerState = Omit<RowInsertParams<any>, 'event'> & {
  top: number
  placement: 'above' | 'below'
}

type RowRendererProps = TableGridRowSlotParams &
  Pick<
    TableV2Props,
    | 'expandColumnKey'
    | 'estimatedRowHeight'
    | 'canEditTable'
    | 'editable'
    | 'editTable'
    | 'ghostTable'
    | 'rowProps'
    | 'rowClass'
    | 'rowKey'
    | 'rowEventHandlers'
    | 'showAddRowTrigger'
  > &
  UnwrapNestedRefs<
    Pick<
      UseTableReturn,
      | 'depthMap'
      | 'expandedRowKeys'
      | 'hasFixedColumns'
      | 'onRowHovered'
      | 'onRowExpanded'
      | 'columnsStyles'
    >
  > & {
    onRowAdd?: RowAddHandler
    onAddRowTriggerChange?: (payload: RowTriggerState | null) => void
    ns: UseNamespaceReturn
    tableInstance?: ComponentInternalInstance
  }

const RowRenderer: FunctionalComponent<RowRendererProps> = (
  props,
  { slots }
) => {
  const {
    columns,
    columnsStyles,
    depthMap,
    expandColumnKey,
    expandedRowKeys,
    estimatedRowHeight,
    hasFixedColumns,
    rowData,
    rowIndex,
    style,
    isScrolling,
    canEditTable,
    editable,
    editTable,
    ghostTable,
    rowProps,
    rowClass,
    rowKey,
    rowEventHandlers,
    onRowAdd,
    onAddRowTriggerChange,
    showAddRowTrigger,
    ns,
    onRowHovered,
    onRowExpanded,
  } = props

  const rowKls = tryCall(rowClass, { columns, rowData, rowIndex }, '')
  const additionalProps = tryCall(rowProps, {
    columns,
    rowData,
    rowIndex,
  })
  const _rowKey = rowData[rowKey]
  const depth = depthMap[_rowKey] || 0
  const canExpand = Boolean(expandColumnKey)
  const isFixedRow = rowIndex < 0
  const isAddRow = Boolean(rowData[rowAddSign])
  const isGhostRow = Boolean(rowData[ghostRowSign])
  const kls = [
    ns.e('row'),
    rowKls,
    isAddRow && ns.is('add-row'),
    isGhostRow && ns.is('ghost-row'),
    ns.is('expanded', canExpand && expandedRowKeys.includes(_rowKey)),
    ns.is('fixed', !depth && isFixedRow),
    ns.is('customized', Boolean(slots.row)),
    {
      [ns.e(`row-depth-${depth}`)]: canExpand && rowIndex >= 0,
    },
  ]

  const onRowHover = hasFixedColumns ? onRowHovered : undefined
  const clearAddRowTrigger = () => {
    onAddRowTriggerChange?.(null)
  }

  const _rowProps = {
    ...additionalProps,
    columns,
    columnsStyles,
    class: kls,
    depth,
    expandColumnKey,
    estimatedRowHeight: isFixedRow ? undefined : estimatedRowHeight,
    isScrolling,
    rowIndex,
    rowData,
    rowKey: _rowKey,
    rowEventHandlers,
    style,
  }

  const handlerMouseEnter = (e: MouseEvent) => {
    onRowHover?.({
      hovered: true,
      rowKey: _rowKey,
      event: e,
      rowData,
      rowIndex,
    })
  }

  const handlerMouseLeave = (e: MouseEvent) => {
    onRowHover?.({
      hovered: false,
      rowKey: _rowKey,
      event: e,
      rowData,
      rowIndex,
    })
  }

  const handlerClick = (e: MouseEvent) => {
    if (!isAddRow) return
    onRowAdd?.({
      event: e,
      rowData,
      rowIndex,
      rowKey: _rowKey,
    })
  }

  const handlerMouseMove = (e: MouseEvent) => {
    const canUseAddRowTrigger = ghostTable ? editTable : canEditTable && editable

    if (!showAddRowTrigger || !canUseAddRowTrigger) {
      clearAddRowTrigger()
      return
    }

    const currentTarget = e.currentTarget as HTMLElement | null
    const root = currentTarget?.closest(`.${ns.b()}`) as HTMLElement | null
    if (!currentTarget || !root || rowIndex < 0) {
      clearAddRowTrigger()
      return
    }

    const rect = currentTarget.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()
    const nearTop = rect.height > 12 && e.clientY - rect.top < 8
    const nearBottom = rect.height > 12 && rect.bottom - e.clientY < 8

    if (nearTop) {
      onAddRowTriggerChange?.({
        row: rowData,
        rowIndex,
        insertIndex: rowIndex,
        top: rect.top - rootRect.top,
        placement: 'below',
      })
      return
    }

    if (nearBottom && !isAddRow && !isGhostRow) {
      onAddRowTriggerChange?.({
        row: rowData,
        rowIndex,
        insertIndex: rowIndex + 1,
        top: rect.bottom - rootRect.top,
        placement: 'above',
      })
      return
    }

    clearAddRowTrigger()
  }

  const handlerMouseOut = (e: MouseEvent) => {
    const currentTarget = e.currentTarget as HTMLElement | null
    const relatedTarget = e.relatedTarget as Node | null
    const triggerSelector = `.${ns.e('add-row-trigger')}`

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

    clearAddRowTrigger()
  }

  return (
    <Row
      {..._rowProps}
      onClick={handlerClick}
      onMousemove={handlerMouseMove}
      onMouseout={handlerMouseOut}
      onRowExpand={onRowExpanded}
      onMouseenter={handlerMouseEnter}
      onMouseleave={handlerMouseLeave}
      rowkey={_rowKey}
    >
      {slots}
    </Row>
  )
}

export default RowRenderer
