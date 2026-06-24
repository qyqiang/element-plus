import { computed, h, inject } from 'vue'
import { merge } from 'lodash-unified'
import { useNamespace } from '@element-plus/hooks'
import { isBoolean, isPropAbsent } from '@element-plus/utils'
import { getRowIdentity } from '../util'
import { TABLE_INJECTION_KEY } from '../tokens'
import useEvents from './events-helper'
import useStyles from './styles-helper'
import TdWrapper from './td-wrapper.vue'

import type { TableBodyProps } from './defaults'
import type {
  DefaultRow,
  RenderRowData,
  Table,
  TableColumnCtx,
  TableProps,
  TreeNode,
} from '../table/defaults'
import type { TreeData } from '../store/tree'
import type { TableOverflowTooltipOptions } from '../util'

function useRender<T extends DefaultRow>(
  props: Partial<TableBodyProps<T>>,
  emit: (...args: any[]) => void
) {
  const parent = inject(TABLE_INJECTION_KEY) as Table<T>
  const ns = useNamespace('table')
  const {
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
  } = useEvents(props, emit)
  const {
    getRowStyle,
    getRowClass,
    getCellStyle,
    getCellClass,
    getSpan,
    getColspanRealWidth,
  } = useStyles(props)

  let displayIndex = -1

  const firstDefaultColumnIndex = computed(() => {
    return props.store?.states.columns.value.findIndex(
      ({ type }) => type === 'default'
    )
  })
  const getKeyOfRow = (row: T, index: number) => {
    const rowKey = (parent?.props as Partial<TableProps<T>>)?.rowKey
    if (rowKey) {
      return getRowIdentity(row, rowKey)
    }
    return index
  }
  const rowRender = (
    row: T,
    $index: number,
    treeRowData?: TreeNode,
    expanded = false
  ) => {
    const {
      tooltipEffect,
      tooltipOptions,
      store,
      rowDraggable,
      onDragstart,
      onDragend,
    } = props
    const { indent, columns } = store!.states
    const rowClasses = []
    let display = true
    if (treeRowData) {
      rowClasses.push(ns.em('row', `level-${treeRowData.level}`))
      display = !!treeRowData.display
    }
    if ($index === 0) {
      displayIndex = -1
    }
    if (props.stripe && display) {
      displayIndex++
    }
    rowClasses.push(...getRowClass(row, $index, displayIndex))
    const displayStyle = display ? null : { display: 'none' }
    return h(
      'tr',
      {
        style: [displayStyle, getRowStyle(row, $index)],
        class: rowClasses,
        key: getKeyOfRow(row, $index),
        draggable:
          typeof rowDraggable === 'function' ? rowDraggable(row) : rowDraggable,
        onDragstart: ($event: Event) => onDragstart($event, row),
        onDragend: ($event: Event) => onDragend($event, row),
        onDblclick: ($event: Event) => handleDoubleClick($event, row),
        onClick: ($event: Event) => handleClick($event, row),
        onContextmenu: ($event: Event) => handleContextMenu($event, row),
        onMouseenter: () => handleMouseEnter($index),
        onMouseleave: handleMouseLeave,
        onMousemove: ($event: MouseEvent) =>
          handleRowMouseMove($event, row, $index),
        onMouseout: ($event: MouseEvent) => handleRowMouseOut($event),
      },
      columns.value.map((column, cellIndex) => {
        const { rowspan, colspan } = getSpan(row, column, $index, cellIndex)
        if (!rowspan || !colspan) {
          return null
        }
        const columnData = Object.assign({}, column)
        columnData.realWidth = getColspanRealWidth(
          columns.value,
          colspan,
          cellIndex
        )
        const data: RenderRowData<T> = {
          store: store!,
          _self: props.context || parent!,
          column: columnData,
          row,
          $index,
          cellIndex,
          expanded,
        }
        if (cellIndex === firstDefaultColumnIndex.value && treeRowData) {
          data.treeNode = {
            indent: treeRowData.level && treeRowData.level * indent.value,
            level: treeRowData.level,
          }
          if (isBoolean(treeRowData.expanded)) {
            data.treeNode.expanded = treeRowData.expanded
            // marks lazy loading state
            if ('loading' in treeRowData) {
              data.treeNode.loading = treeRowData.loading
            }
            if ('noLazyChildren' in treeRowData) {
              data.treeNode.noLazyChildren = treeRowData.noLazyChildren
            }
          }
        }
        const baseKey = `${getKeyOfRow(row, $index)},${cellIndex}`
        const patchKey = columnData.columnKey || columnData.rawColumnKey || ''
        const mergedTooltipOptions =
          column.showOverflowTooltip &&
          merge(
            {
              effect: tooltipEffect,
            },
            tooltipOptions,
            column.showOverflowTooltip
          )
        return h(
          TdWrapper,
          {
            style: getCellStyle($index, cellIndex, row, column),
            class: getCellClass($index, cellIndex, row, column, colspan - 1),
            key: `${patchKey}${baseKey}`,
            rowspan,
            cellIndex,
            columnIndex: $index,
            colspan,
            onClick: ($event: Event) =>
              handleCellClick($event, row, column, $index, cellIndex),
            onMouseenter: ($event: MouseEvent) =>
              handleCellMouseEnter(
                $event,
                row,
                mergedTooltipOptions as TableOverflowTooltipOptions
              ),
            onMouseleave: handleCellMouseLeave,
          },
          {
            default: () => cellChildren(cellIndex, column, data),
          }
        )
      })
    )
  }
  const cellChildren = <T extends DefaultRow>(
    _cellIndex: number,
    column: TableColumnCtx<T>,
    data: RenderRowData<T>
  ) => {
    return column.renderCell(data)
  }

  const wrappedRowRender = (row: T, $index: number) => {
    const store = props.store!
    const { isRowExpanded, assertRowKey } = store
    const { treeData, lazyTreeNodeMap, childrenColumnName, rowKey } =
      store.states
    const columns = store.states.columns.value
    const hasExpandColumn = columns.some(({ type }) => type === 'expand')
    if (hasExpandColumn) {
      const expanded = isRowExpanded(row)
      const tr = rowRender(row, $index, undefined, expanded)
      const renderExpanded = parent?.renderExpanded
      if (!renderExpanded) {
        console.error('[Element Error]renderExpanded is required.')
        return tr
      }

      // avoid calling h when expanded content is not needed
      // return early when not preserving content and the row is collapsed
      // wrap with a 2D array to avoid mutating $index
      const rows = [[tr]]

      // only create the expanded row when it is actually needed
      if (parent.props.preserveExpandedContent || expanded) {
        rows[0].push(
          h(
            'tr',
            {
              key: `expanded-row__${tr.key as string}`,
              style: { display: expanded ? '' : 'none' },
            },
            [
              h(
                'td',
                {
                  colspan: columns.length,
                  class: `${ns.e('cell')} ${ns.e('expanded-cell')}`,
                },
                [renderExpanded({ row, $index, store, expanded })]
              ),
            ]
          )
        )
      }

      return rows
    } else if (Object.keys(treeData.value).length) {
      assertRowKey()
      // TreeTable requires a user-defined rowKey instead of getKeyOfRow
      // rowRender still recomputes rowKey here, which is not ideal
      const key = getRowIdentity(row, rowKey.value)
      let cur = treeData.value[key]
      let treeRowData = null
      if (cur) {
        treeRowData = {
          expanded: cur.expanded,
          level: cur.level,
          display: true,
          noLazyChildren: undefined as boolean | undefined,
          loading: undefined as boolean | undefined,
        }
        if (isBoolean(cur.lazy)) {
          if (treeRowData && isBoolean(cur.loaded) && cur.loaded) {
            treeRowData.noLazyChildren = !(cur.children && cur.children.length)
          }
          treeRowData.loading = cur.loading
        }
      }
      const tmp = [rowRender(row, $index, treeRowData ?? undefined)]
      // render nested data
      if (cur) {
        // currentRow stores the index, so TreeTable indices must be offset
        let i = 0
        const traverse = (children: T[], parent: TreeData) => {
          if (!(children && children.length && parent)) return
          children.forEach((node) => {
            // the parent display state controls child visibility
            const innerTreeRowData: Partial<Record<string, any>> = {
              display: parent.display && parent.expanded,
              level: parent.level! + 1,
              expanded: false,
              noLazyChildren: false,
              loading: false,
            }
            const childKey = getRowIdentity(node, rowKey.value)
            if (isPropAbsent(childKey)) {
              throw new Error('For nested data item, row-key is required.')
            }
            cur = { ...treeData.value[childKey] }
            // handle current nodes differently depending on child presence.
            // when children exist, sync the expanded flag.
            // child display depends on both the current expanded and display state.
            if (cur) {
              innerTreeRowData.expanded = cur.expanded
              // some lazy-loaded nodes do not have a known level yet
              cur.level = cur.level || innerTreeRowData.level
              cur.display = !!(cur.expanded && innerTreeRowData.display)
              if (isBoolean(cur.lazy)) {
                if (isBoolean(cur.loaded) && cur.loaded) {
                  innerTreeRowData.noLazyChildren = !(
                    cur.children && cur.children.length
                  )
                }
                innerTreeRowData.loading = cur.loading
              }
            }
            i++
            tmp.push(rowRender(node, $index + i, innerTreeRowData))
            if (cur) {
              const nodes =
                lazyTreeNodeMap.value[childKey] ||
                node[childrenColumnName.value]
              traverse(nodes, cur)
            }
          })
        }
        // root nodes are always displayed
        cur.display = true
        const nodes =
          lazyTreeNodeMap.value[key] || row[childrenColumnName.value]
        traverse(nodes, cur)
      }
      return tmp
    } else {
      return rowRender(row, $index, undefined)
    }
  }

  return {
    wrappedRowRender,
    tooltipContent,
    tooltipTrigger,
  }
}

export default useRender
