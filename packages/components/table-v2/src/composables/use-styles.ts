import { computed, unref } from 'vue'
import { addUnit, isNumber } from '@element-plus/utils'
import { enforceUnit, sum } from '../utils'

import type { CSSProperties, ComputedRef } from 'vue'
import type { TableV2Props } from '../table'
import type { UseColumnsReturn } from './use-columns'

type UseStyleProps = {
  columnsTotalWidth: UseColumnsReturn['columnsTotalWidth']
  fixedColumnsOnLeft: UseColumnsReturn['fixedColumnsOnLeft']
  fixedColumnsOnRight: UseColumnsReturn['fixedColumnsOnRight']
  rowsHeight: ComputedRef<number>
  showEmpty: ComputedRef<boolean>
  effectiveWidth: ComputedRef<number>
  reservedVScrollbarWidth: ComputedRef<number>
}

export const useStyles = (
  props: TableV2Props,
  {
    columnsTotalWidth,
    rowsHeight,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    effectiveWidth,
    reservedVScrollbarWidth,
    showEmpty,
  }: UseStyleProps
) => {
  const availableBodyWidth = computed(() =>
    Math.max(unref(effectiveWidth) - unref(reservedVScrollbarWidth), 0)
  )

  const hasHorizontalScrollbar = computed(
    () => props.fixed && unref(columnsTotalWidth) > unref(availableBodyWidth)
  )

  const effectiveHScrollbarSize = computed(() =>
    hasHorizontalScrollbar.value ? props.hScrollbarSize : 0
  )

  const addRowHeight = computed(() =>
    (props.canEditTable && props.editable) ||
    (props.ghostTable && props.editTable)
      ? props.rowHeight
      : 0
  )

  const shouldUseDefaultFooterHeight = computed(
    () => props.isFooterDefault && props.footerHeight === 0
  )

  const effectiveFooterHeight = computed(() =>
    shouldUseDefaultFooterHeight.value ? 44 : props.footerHeight
  )

  const contentHeight = computed(() => {
    const _fixedRowsHeight = unref(fixedRowsHeight)
    const _rowsHeight = unref(rowsHeight)
    const _headerHeight = unref(headerHeight)

    return (
      _headerHeight +
      _fixedRowsHeight +
      _rowsHeight +
      (unref(showEmpty) ? props.rowHeight : 0) +
      unref(effectiveHScrollbarSize)
    )
  })

  const bodyWidth = computed(() => {
    const { fixed } = props
    const ret = unref(availableBodyWidth)
    return fixed ? Math.max(Math.round(unref(columnsTotalWidth)), ret) : ret
  })

  const mainTableHeight = computed(() => {
    const { height, maxHeight = 0 } = props
    const footerHeight = unref(effectiveFooterHeight)
    const addRowSpace = unref(addRowHeight)
    const availableMaxHeight = Math.max(
      maxHeight - footerHeight - addRowSpace,
      0
    )

    if (maxHeight > 0) {
      return Math.min(unref(contentHeight), availableMaxHeight)
    }

    if (isNumber(height)) {
      return Math.max(height - footerHeight - addRowSpace, 0)
    }

    return unref(contentHeight)
  })

  const fixedTableHeight = computed(() => {
    const { maxHeight } = props
    const tableHeight = unref(mainTableHeight)
    if (isNumber(maxHeight) && maxHeight > 0) return tableHeight

    const totalHeight =
      unref(rowsHeight) + unref(headerHeight) + unref(fixedRowsHeight)

    return Math.min(tableHeight, totalHeight)
  })

  const mapColumn = (column: TableV2Props['columns'][number]) =>
    typeof column.width === 'number' ? column.width : 0

  const leftTableWidth = computed(() =>
    sum(unref(fixedColumnsOnLeft).map(mapColumn))
  )

  const rightTableWidth = computed(() =>
    sum(unref(fixedColumnsOnRight).map(mapColumn))
  )

  const headerHeight = computed(() => sum(props.headerHeight))

  const fixedRowsHeight = computed(() => {
    return (props.fixedData?.length || 0) * props.rowHeight
  })

  const windowHeight = computed(() => {
    return unref(mainTableHeight) - unref(headerHeight) - unref(fixedRowsHeight)
  })

  const rootHeight = computed(() => {
    return (
      unref(mainTableHeight) +
      unref(effectiveFooterHeight) +
      unref(addRowHeight)
    )
  })

  const rootStyle = computed<CSSProperties>(() => {
    const { style = {}, height, maxHeight, width } = props
    return enforceUnit({
      ...style,
      height: height ?? unref(rootHeight),
      maxHeight: height == null ? addUnit(maxHeight) : undefined,
      width: width ?? '100%',
    })
  })

  const footerHeight = computed(() =>
    enforceUnit({ height: unref(effectiveFooterHeight) })
  )

  const emptyStyle = computed<CSSProperties>(() => ({
    top: addUnit(unref(headerHeight)),
    height: addUnit(props.rowHeight),
    width: addUnit(unref(effectiveWidth)),
  }))

  return {
    addRowHeight,
    bodyWidth,
    effectiveHScrollbarSize,
    hasHorizontalScrollbar,
    fixedTableHeight,
    mainTableHeight,
    leftTableWidth,
    rightTableWidth,
    windowHeight,
    footerHeight,
    effectiveFooterHeight,
    emptyStyle,
    rootStyle,
    headerHeight,
    effectiveWidth,
    rootHeight,
  }
}

export type UseStyleReturn = ReturnType<typeof useStyles>
