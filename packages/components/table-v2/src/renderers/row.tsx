import { Row } from '../components'
import { rowAddSign } from '../private'
import { tryCall } from '../utils'

import type {
  ComponentInternalInstance,
  FunctionalComponent,
  UnwrapNestedRefs,
} from 'vue'
import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { RowAddHandler } from '../row'
import type { UseTableReturn } from '../use-table'
import type { TableV2Props } from '../table'
import type { TableGridRowSlotParams } from '../table-grid'

type RowRendererProps = TableGridRowSlotParams &
  Pick<
    TableV2Props,
    | 'expandColumnKey'
    | 'estimatedRowHeight'
    | 'rowProps'
    | 'rowClass'
    | 'rowKey'
    | 'rowEventHandlers'
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
    rowProps,
    rowClass,
    rowKey,
    rowEventHandlers,
    onRowAdd,
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
  const kls = [
    ns.e('row'),
    rowKls,
    isAddRow && ns.is('add-row'),
    ns.is('expanded', canExpand && expandedRowKeys.includes(_rowKey)),
    ns.is('fixed', !depth && isFixedRow),
    ns.is('customized', Boolean(slots.row)),
    {
      [ns.e(`row-depth-${depth}`)]: canExpand && rowIndex >= 0,
    },
  ]

  const onRowHover = hasFixedColumns ? onRowHovered : undefined

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

  return (
    <Row
      {..._rowProps}
      onClick={handlerClick}
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
