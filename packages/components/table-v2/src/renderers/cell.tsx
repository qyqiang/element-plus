import { renderSlot } from 'vue'
import ElIcon from '@element-plus/components/icon'
import ElButton from '@element-plus/components/button'
import { get, set } from 'lodash-unified'
import { isFunction, isObject } from '@element-plus/utils'
import { ExpandIcon, TableCell } from '../components'
import { Alignment } from '../constants'
import {
  ghostRowKey,
  placeholderSign,
  rowAddSign,
  rowDeleteColumnKey,
} from '../private'
import {
  applyRequiredInputState,
  isEmptyRequiredValue,
  isGhostTableRow,
} from '../ghost-table'
import { componentToSlot, enforceUnit, tryCall } from '../utils'

import type { FunctionalComponent, UnwrapNestedRefs, VNode } from 'vue'
import type { TableV2RowCellRenderParam } from '../components'
import type { UseNamespaceReturn } from '@element-plus/hooks'
import type { RowAddHandler, RowDeleteHandler } from '../row'
import type { UseTableReturn } from '../use-table'
import type { GhostRowAddParams, TableV2Props } from '../table'

type CellRendererProps = TableV2RowCellRenderParam &
  Pick<
    TableV2Props,
    | 'canEditTable'
    | 'cellProps'
    | 'editable'
    | 'editTable'
    | 'expandColumnKey'
    | 'ghostTable'
    | 'indentSize'
    | 'iconSize'
    | 'rowKey'
  > &
  UnwrapNestedRefs<Pick<UseTableReturn, 'expandedRowKeys'>> & {
    onRowAdd?: RowAddHandler
    onAddGhostRow?: (params: GhostRowAddParams<any>) => void
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
    editTable,
    expandColumnKey,
    ghostTable,
    indentSize,
    iconSize,
    onAddGhostRow,
    onRowAdd,
    onRowDelete,
    rowKey,
  },
  { slots }
) => {
  const cellStyle = enforceUnit(style)

  if (column.placeholderSign === placeholderSign) {
    return <div class={ns.em('row-cell', 'placeholder')} style={cellStyle} />
  }
  const { cellRenderer, dataKey, dataGetter, editCellRenderer } = column

  const getCellData = () =>
    isFunction(dataGetter)
      ? dataGetter({ columns, column, columnIndex, rowData, rowIndex })
      : get(rowData, dataKey ?? '')

  const setCellData = (value: unknown) => {
    if (!rowData || dataKey == null) return

    if (typeof dataKey === 'symbol') {
      rowData[dataKey] = value
      return
    }

    set(rowData, dataKey, value)
  }

  const baseCellProps = {
    class: ns.e('cell-text'),
    columns,
    column,
    columnIndex,
    isScrolling,
    rowData,
    rowIndex,
  }
  const cellProps = Object.defineProperty(baseCellProps, 'cellData', {
    enumerable: true,
    configurable: true,
    get: getCellData,
    set: setCellData,
  }) as typeof baseCellProps & {
    cellData: ReturnType<typeof getCellData>
  }

  const extraCellProps = tryCall(_cellProps, cellProps)
  const isAddRow = Boolean(rowData[rowAddSign])
  const isGhostRow = isGhostTableRow(rowData)
  const isRowDeleteColumn = column.key === rowDeleteColumnKey
  const columnCellRenderer = componentToSlot<typeof cellProps>(cellRenderer)
  const editColumnCellRenderer =
    componentToSlot<typeof cellProps>(editCellRenderer)
  const shouldRenderEditor = canEditTable ? editable : true
  const actualColumns = columns.filter(
    (item) => item.placeholderSign !== placeholderSign
  )
  const actualColumnCount = actualColumns.length
  const actualColumnIndex = actualColumns.findIndex(
    (item) => item.key === column.key
  )
  const shouldRenderGhostAddButton =
    ghostTable &&
    editTable &&
    isGhostRow &&
    actualColumnIndex > -1 &&
    (actualColumnCount === 1
      ? actualColumnIndex === 0
      : actualColumnIndex === actualColumnCount - 1)
  const shouldRenderGhostEditCell =
    ghostTable &&
    editTable &&
    Boolean(editColumnCellRenderer) &&
    !shouldRenderGhostAddButton
  const requiredColumns = actualColumns.filter(
    (item) =>
      item.required && item.dataKey != null && item.key !== rowDeleteColumnKey
  )
  const isGhostRowAddDisabled = requiredColumns.some((item) =>
    isEmptyRequiredValue(get(rowData, item.dataKey ?? ''))
  )
  const Cell = isRowDeleteColumn ? (
    isAddRow ? (
      <ElButton
        text
        class={[ns.e('row-add-button'), 'icon-button']}
        onClick={(event: MouseEvent) => {
          event.stopPropagation()
          onRowAdd?.({
            event,
            rowData,
            rowIndex,
            rowKey: rowData[rowKey],
          })
        }}
      >
        <ElIcon size={12}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <path d="M3.82026 11.0062C3.64674 11.0063 3.4749 10.9711 3.3146 10.9026C3.1543 10.8341 3.00868 10.7337 2.88608 10.6072L0 7.6341L1.10129 6.49954L3.82026 9.30198L10.8987 2.00623L12 3.14079L4.75443 10.6072C4.63183 10.7337 4.48621 10.8341 4.32591 10.9026C4.16561 10.9711 3.99378 11.0063 3.82026 11.0062Z" />
          </svg>
        </ElIcon>
      </ElButton>
    ) : (
      <ElButton
        link
        class={ns.e('row-delete-button')}
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
    )
  ) : shouldRenderGhostAddButton ? (
    <ElButton
      text
      class="icon-button"
      disabled={isGhostRowAddDisabled}
      onClick={(event: MouseEvent) => {
        event.stopPropagation()
        if (isGhostRowAddDisabled) return
        onAddGhostRow?.({
          event,
          row: rowData,
          rowIndex,
          rowKey: rowData[ghostRowKey] ?? rowData[rowKey],
        })
      }}
    >
      <ElIcon size={12}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path d="M3.82026 11.0062C3.64674 11.0063 3.4749 10.9711 3.3146 10.9026C3.1543 10.8341 3.00868 10.7337 2.88608 10.6072L0 7.6341L1.10129 6.49954L3.82026 9.30198L10.8987 2.00623L12 3.14079L4.75443 10.6072C4.63183 10.7337 4.48621 10.8341 4.32591 10.9026C4.16561 10.9711 3.99378 11.0063 3.82026 11.0062Z" />
        </svg>
      </ElIcon>
    </ElButton>
  ) : shouldRenderGhostEditCell ? (
    (() => {
      const rendered = editColumnCellRenderer!(cellProps)
      return applyRequiredInputState(rendered, column, rowData)
    })()
  ) : shouldRenderEditor && columnCellRenderer ? (
    columnCellRenderer(cellProps)
  ) : (
    renderSlot(slots, 'default', cellProps, () => [
      <TableCell {...cellProps}></TableCell>,
    ])
  )

  const kls = [
    ns.e('row-cell'),
    column.diagonalHeader && 'is-diagonal-header-column',
    ghostTable && 'is-full-width',
    isGhostRow && ns.is('ghost-row'),
    column.required && 'required-column',
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
