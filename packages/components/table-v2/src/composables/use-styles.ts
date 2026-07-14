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
  effectiveWidth: ComputedRef<number>
}

export const useStyles = (
  props: TableV2Props,
  {
    columnsTotalWidth,
    rowsHeight,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    effectiveWidth,
  }: UseStyleProps
) => {
  const addRowHeight = computed(() =>
    (props.canEditTable && props.editable) ||
    (props.ghostTable && props.editTable)
      ? props.rowHeight
      : 0
  )

  const shouldUseEditableDefaultFooterHeight = computed(
    () =>
      props.isFooterDefault &&
      props.footerHeight === 0 &&
      ((props.canEditTable && props.editable) ||
        (props.ghostTable && props.editTable))
  )

  const effectiveFooterHeight = computed(() =>
    shouldUseEditableDefaultFooterHeight.value ? 44 : props.footerHeight
  )

  const bodyWidth = computed(() => {
    const { fixed, vScrollbarSize } = props
    const width = unref(effectiveWidth)
    const ret = Math.max(width - vScrollbarSize, 0)
    return fixed ? Math.max(Math.round(unref(columnsTotalWidth)), ret) : ret
  })

  const mainTableHeight = computed(() => {
    const { height = 0, maxHeight = 0, hScrollbarSize } = props
    const footerHeight = unref(effectiveFooterHeight)

    if (maxHeight > 0) {
      const _fixedRowsHeight = unref(fixedRowsHeight)
      const _rowsHeight = unref(rowsHeight)
      const _headerHeight = unref(headerHeight)
      const total =
        _headerHeight + _fixedRowsHeight + _rowsHeight + hScrollbarSize

      return Math.min(total, maxHeight - footerHeight - unref(addRowHeight))
    }

    return height - footerHeight - unref(addRowHeight)
  })

  const fixedTableHeight = computed(() => {
    const { maxHeight } = props
    const tableHeight = unref(mainTableHeight)
    if (isNumber(maxHeight) && maxHeight > 0) return tableHeight

    const totalHeight =
      unref(rowsHeight) + unref(headerHeight) + unref(fixedRowsHeight)

    return Math.min(tableHeight, totalHeight)
  })

  const mapColumn = (column: TableV2Props['columns'][number]) => column.width ?? 0

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

  const rootStyle = computed<CSSProperties>(() => {
    const { style = {}, height, width } = props
    return enforceUnit({
      ...style,
      height,
      width: width ?? '100%',
    })
  })

  const footerHeight = computed(() =>
    enforceUnit({ height: unref(effectiveFooterHeight) })
  )

  const emptyStyle = computed<CSSProperties>(() => ({
    top: addUnit(unref(headerHeight)),
    bottom: addUnit(unref(effectiveFooterHeight) + unref(addRowHeight)),
    width: addUnit(unref(effectiveWidth)),
  }))

  return {
    addRowHeight,
    bodyWidth,
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
  }
}

export type UseStyleReturn = ReturnType<typeof useStyles>
