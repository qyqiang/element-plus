import { renderSlot } from 'vue'
import ElIcon from '@element-plus/components/icon'
import ElButton from '@element-plus/components/button'
import { get } from 'lodash-unified'
import { isFunction, isObject } from '@element-plus/utils'
import { ExpandIcon, TableCell } from '../components'
import { Alignment } from '../constants'
import { placeholderSign, rowDeleteColumnKey } from '../private'
import { componentToSlot, enforceUnit, tryCall } from '../utils'

import type { FunctionalComponent, UnwrapNestedRefs, VNode } from 'vue'
import type { TableV2RowCellRenderParam } from '../components'
import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { RowDeleteHandler } from '../row'
import type { UseTableReturn } from '../use-table'
import type { TableV2Props } from '../table'

type CellRendererProps = TableV2RowCellRenderParam &
  Pick<
    TableV2Props,
    | 'canEditTable'
    | 'cellProps'
    | 'editable'
    | 'expandColumnKey'
    | 'indentSize'
    | 'iconSize'
    | 'rowKey'
  > &
  UnwrapNestedRefs<Pick<UseTableReturn, 'expandedRowKeys'>> & {
    onRowDelete?: RowDeleteHandler
    ns: UseNamespaceReturn
  }

const CellRenderer: FunctionalComponent<CellRendererProps> = (
  {
    // renderer props
    columns,
    column,
    columnIndex,
    depth,
    expandIconProps,
    isScrolling,
    rowData,
    rowIndex,
    // from use-table
    style,
    expandedRowKeys,
    ns,
    // derived props
    canEditTable,
    cellProps: _cellProps,
    editable,
    expandColumnKey,
    indentSize,
    iconSize,
    onRowDelete,
    rowKey,
  },
  { slots }
) => {
  const cellStyle = enforceUnit(style)

  if (column.placeholderSign === placeholderSign) {
    return <div class={ns.em('row-cell', 'placeholder')} style={cellStyle} />
  }
  const { cellRenderer, dataKey, dataGetter } = column

  const cellData = isFunction(dataGetter)
    ? dataGetter({ columns, column, columnIndex, rowData, rowIndex })
    : get(rowData, dataKey ?? '')

  const extraCellProps = tryCall(_cellProps, {
    cellData,
    columns,
    column,
    columnIndex,
    rowIndex,
    rowData,
  })

  const cellProps = {
    class: ns.e('cell-text'),
    columns,
    column,
    columnIndex,
    cellData,
    isScrolling,
    rowData,
    rowIndex,
  }
  const isRowDeleteColumn = column.key === rowDeleteColumnKey
  const columnCellRenderer = componentToSlot<typeof cellProps>(cellRenderer)
  const shouldRenderEditor = canEditTable ? editable : true
  const Cell = isRowDeleteColumn ? (
    <ElButton
      type="text"
      class="icon-button"
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
        onRowDelete?.({
          event,
          rowData,
          rowIndex,
          rowKey: rowData[rowKey],
        })
      }}
    >
      <ElIcon size="16px" class="delete-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path d="M11.334 2.66667V1.33333C11.334 0.979711 11.1935 0.640573 10.9435 0.390524C10.6934 0.140476 10.3543 0 10.0007 0L6.00065 0C5.64703 0 5.30789 0.140476 5.05784 0.390524C4.80779 0.640573 4.66732 0.979711 4.66732 1.33333V2.66667H1.33398V4H2.66732V14C2.66732 14.5304 2.87803 15.0391 3.2531 15.4142C3.62818 15.7893 4.13688 16 4.66732 16H11.334C11.8644 16 12.3731 15.7893 12.7482 15.4142C13.1233 15.0391 13.334 14.5304 13.334 14V4H14.6673V2.66667H11.334ZM7.33398 11.3333H6.00065V7.33333H7.33398V11.3333ZM10.0007 11.3333H8.66732V7.33333H10.0007V11.3333ZM10.0007 2.66667H6.00065V1.33333H10.0007V2.66667Z" />
        </svg>
      </ElIcon>
    </ElButton>
  ) : shouldRenderEditor && columnCellRenderer ? (
    columnCellRenderer(cellProps)
  ) : (
    renderSlot(slots, 'default', cellProps, () => [
      <TableCell {...cellProps}></TableCell>,
    ])
  )

  const kls = [
    ns.e('row-cell'),
    column.class,
    column.align === Alignment.CENTER && ns.is('align-center'),
    column.align === Alignment.RIGHT && ns.is('align-right'),
  ]

  const expandable =
    rowIndex >= 0 && expandColumnKey && column.key === expandColumnKey
  const expanded = rowIndex >= 0 && expandedRowKeys.includes(rowData[rowKey])

  let IconOrPlaceholder: VNode | undefined
  const iconStyle = `margin-inline-start: ${depth * indentSize}px;`
  if (expandable) {
    if (isObject(expandIconProps)) {
      IconOrPlaceholder = (
        <ExpandIcon
          {...expandIconProps}
          class={[ns.e('expand-icon'), ns.is('expanded', expanded)]}
          size={iconSize}
          expanded={expanded}
          style={iconStyle}
          expandable
        />
      )
    } else {
      IconOrPlaceholder = (
        <div
          style={[
            iconStyle,
            `width: ${iconSize}px; height: ${iconSize}px;`,
          ].join(' ')}
        />
      )
    }
  }

  return (
    <div class={kls} style={cellStyle} {...extraCellProps} role="cell">
      {IconOrPlaceholder}
      {Cell}
    </div>
  )
}

CellRenderer.inheritAttrs = false

export default CellRenderer
