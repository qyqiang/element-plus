import { computed, ref, unref } from 'vue'
import { isObject } from '@element-plus/utils'
import { FixedDir, SortOrder, nextSortOrderMap } from '../constants'
import {
  placeholderSign,
  rowDeleteColumnKey,
  rowDeleteColumnWidth,
  rowDeletePlaceholderMergedSign,
} from '../private'
import { calcColumnStyle } from './utils'

import type { CSSProperties, Ref } from 'vue'
import type { TableV2Props } from '../table'
import type { AnyColumns, Column, KeyType } from '../types'

const AUTO_COLUMN_PADDING = 48
const MIN_AUTO_COLUMN_WIDTH = 80
const FALLBACK_HEADER_CHAR_WIDTH = 8
const textWidthCache = new Map<string, number>()
const PERCENTAGE_WIDTH_RE = /^\s*(-?\d+(?:\.\d+)?)%\s*$/
const PIXEL_WIDTH_RE = /^\s*(-?\d+(?:\.\d+)?)(?:px)?\s*$/

const measureHeaderTextWidth = (text: string) => {
  if (textWidthCache.has(text)) return textWidthCache.get(text)!

  let width = text.length * FALLBACK_HEADER_CHAR_WIDTH
  const isJsdom =
    typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent)

  if (typeof document !== 'undefined' && !isJsdom) {
    try {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (context) {
        context.font = '400 14px Inter, sans-serif'
        width = Math.ceil(context.measureText(text).width)
      }
    } catch {
      // jsdom does not implement canvas measurement, so keep the fallback width.
    }
  }

  textWidthCache.set(text, width)
  return width
}

const getAutoColumnWidth = (column: Column<any>) =>
  Math.max(
    MIN_AUTO_COLUMN_WIDTH,
    measureHeaderTextWidth(String(column.title ?? '')) + AUTO_COLUMN_PADDING
  )

const resolveColumnWidth = (
  width: Column<any>['width'],
  referenceWidth: number
) => {
  if (typeof width === 'number') return width
  if (typeof width !== 'string') return undefined

  const percentageMatch = width.match(PERCENTAGE_WIDTH_RE)
  if (percentageMatch) {
    return Math.round((referenceWidth * Number(percentageMatch[1])) / 100)
  }

  const pixelMatch = width.match(PIXEL_WIDTH_RE)
  if (pixelMatch) {
    return Number(pixelMatch[1])
  }

  return undefined
}

function useColumns(
  props: TableV2Props,
  columns: Ref<AnyColumns>,
  fixed: Ref<boolean>,
  effectiveWidth: Ref<number>,
  reservedVScrollbarWidth: Ref<number>
) {
  const columnWidths = ref<Record<KeyType, number>>({})

  const _columns = computed<AnyColumns>(() => {
    const availableWidth = Math.max(
      unref(effectiveWidth) - unref(reservedVScrollbarWidth),
      0
    )
    const normalizedColumns: AnyColumns = unref(columns).map(
      (column, index) => {
        const key = column.key ?? column.dataKey ?? index

        return {
          ...column,
          key,
          resizable: column.resizable !== false,
          width:
            columnWidths.value[key] ??
            resolveColumnWidth(column.width, availableWidth),
        }
      }
    )

    const rowDeleteColumn: Column<any> = {
      key: rowDeleteColumnKey,
      dataKey: rowDeleteColumnKey,
      title: '',
      width: rowDeleteColumnWidth,
      resizable: false,
      fixed: FixedDir.RIGHT,
      align: 'center',
      class: 'is-row-delete-column',
      headerClass: 'is-row-delete-column',
    }

    const shouldAppendActionColumn =
      (props.canEditTable && props.editable) ||
      (props.ghostTable && props.editTable)

    const columnsWithEditAction = shouldAppendActionColumn
      ? [...normalizedColumns, rowDeleteColumn]
      : normalizedColumns

    const visibleColumns = columnsWithEditAction.filter(
      (column) => !column.hidden
    )
    const autoWidthCandidates = visibleColumns.filter(
      (column) => column.width == null
    )

    if (!autoWidthCandidates.length) return columnsWithEditAction

    const stretchColumn = autoWidthCandidates[autoWidthCandidates.length - 1]

    const resolvedColumns = columnsWithEditAction.map((column) => {
      if (column.width != null) return column

      return {
        ...column,
        width: getAutoColumnWidth(column),
      }
    })

    const otherWidth = resolvedColumns
      .filter(
        (column) =>
          !column.hidden && (column.key ?? column.dataKey) !== stretchColumn.key
      )
      .reduce(
        (width, column) =>
          width + (typeof column.width === 'number' ? column.width : 0),
        0
      )

    const stretchWidth = Math.max(
      getAutoColumnWidth(stretchColumn),
      availableWidth - otherWidth
    )

    return resolvedColumns.map((column) =>
      column.key === stretchColumn.key
        ? {
            ...column,
            width: stretchWidth,
          }
        : column
    )
  })

  const visibleColumns = computed(() => {
    return unref(_columns).filter((column) => !column.hidden)
  })

  const fixedColumnsOnLeft = computed(() =>
    unref(visibleColumns).filter(
      (column) => column.fixed === 'left' || column.fixed === true
    )
  )

  const fixedColumnsOnRight = computed(() =>
    unref(visibleColumns).filter((column) => column.fixed === 'right')
  )

  const normalColumns = computed(() =>
    unref(visibleColumns).filter((column) => !column.fixed)
  )

  const rowDeletePlaceholderMerge = computed(() => {
    const rowDeleteColumn = unref(fixedColumnsOnRight).find(
      (column) => column.key === rowDeleteColumnKey
    )
    const targetColumn = [...unref(normalColumns)]
      .reverse()
      .find((column) => column.key !== rowDeleteColumnKey)

    return rowDeleteColumn && targetColumn
      ? { rowDeleteColumn, targetColumn }
      : undefined
  })

  const mainColumns = computed(() => {
    const ret: AnyColumns = []
    const merge = unref(rowDeletePlaceholderMerge)

    unref(fixedColumnsOnLeft).forEach((column) => {
      ret.push({
        ...column,
        placeholderSign,
      })
    })

    unref(normalColumns).forEach((column) => {
      ret.push(
        column.key === merge?.targetColumn.key
          ? {
              ...column,
              [rowDeletePlaceholderMergedSign]: true,
            }
          : column
      )
    })

    unref(fixedColumnsOnRight).forEach((column) => {
      if (column.key === merge?.rowDeleteColumn.key) return

      ret.push({
        ...column,
        placeholderSign,
      })
    })

    return ret
  })

  const hasFixedColumns = computed(() => {
    return unref(fixedColumnsOnLeft).length || unref(fixedColumnsOnRight).length
  })

  const columnsStyles = computed(() => {
    const styles = unref(_columns).reduce<Record<KeyType, CSSProperties>>(
      (style, column) => {
        const key = column.key!
        style[key] = calcColumnStyle(column, unref(fixed), props.fixed)
        return style
      },
      {}
    )
    const merge = unref(rowDeletePlaceholderMerge)

    if (merge) {
      const targetKey = merge.targetColumn.key!
      const targetWidth =
        typeof merge.targetColumn.width === 'number'
          ? merge.targetColumn.width
          : 0
      const rowDeleteWidth =
        typeof merge.rowDeleteColumn.width === 'number'
          ? merge.rowDeleteColumn.width
          : 0

      styles[targetKey] = {
        ...styles[targetKey],
        width: targetWidth + rowDeleteWidth,
      }
    }

    return styles
  })

  const columnsTotalWidth = computed(() => {
    return unref(visibleColumns).reduce(
      (width, column) =>
        width + (typeof column.width === 'number' ? column.width : 0),
      0
    )
  })

  const getColumn = (key: KeyType) => {
    return unref(_columns).find((column) => column.key === key)
  }

  const getColumnStyle = (key: KeyType) => {
    return unref(columnsStyles)[key]
  }

  const updateColumnWidth = (column: Column<any>, width: number) => {
    columnWidths.value = {
      ...columnWidths.value,
      [column.key!]: width,
    }
    column.width = width
  }

  function onColumnSorted(e: MouseEvent) {
    const { key } = (e.currentTarget as HTMLElement).dataset
    if (!key) return
    const { sortState, sortBy } = props

    let order = SortOrder.DESC

    if (isObject(sortState)) {
      order = nextSortOrderMap[sortState[key] ?? SortOrder.DEFAULT]
    } else {
      order =
        sortBy.key === key
          ? nextSortOrderMap[sortBy.order ?? SortOrder.DEFAULT]
          : SortOrder.DESC
    }

    props.onColumnSort?.({ column: getColumn(key)!, key, order })
  }

  return {
    columns: _columns,
    columnsStyles,
    columnsTotalWidth,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    hasFixedColumns,
    mainColumns,
    normalColumns,
    visibleColumns,

    getColumn,
    getColumnStyle,
    updateColumnWidth,
    onColumnSorted,
  }
}

export { useColumns }
export type UseColumnsReturn = ReturnType<typeof useColumns>
