import {
  computed,
  getCurrentInstance,
  ref,
  shallowRef,
  toRef,
  unref,
  watch,
} from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { isArray, isNumber } from '@element-plus/utils'
import { useNamespace } from '@element-plus/hooks'
import {
  useColumns,
  useData,
  useRow,
  useScrollbar,
  useStyles,
} from './composables'

import type { TableV2Props } from './table'
import type { TableGridInstance } from './table-grid'

function useTable(props: TableV2Props) {
  const mainTableRef = ref<TableGridInstance>()
  const leftTableRef = ref<TableGridInstance>()
  const rightTableRef = ref<TableGridInstance>()
  const containerRef = ref<HTMLElement>()
  const observedWidth = ref(0)
  const effectiveWidth = computed(() => props.width ?? observedWidth.value)
  const reservedVScrollbarWidth = computed(() =>
    (props.canEditTable && props.editable) ||
    (props.ghostTable && props.editTable)
      ? props.vScrollbarSize
      : 0
  )

  useResizeObserver(containerRef, ([entry]) => {
    observedWidth.value = entry.contentRect.width
  })

  const {
    columns,
    columnsStyles,
    columnsTotalWidth,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    hasFixedColumns,
    mainColumns,
    visibleColumns,

    updateColumnWidth,
    onColumnSorted,
  } = useColumns(
    props,
    toRef(props, 'columns'),
    toRef(props, 'fixed'),
    effectiveWidth,
    reservedVScrollbarWidth
  )

  const {
    scrollTo,
    scrollToLeft,
    scrollToTop,
    scrollToRow,
    onScroll,
    onVerticalScroll,
    scrollPos,
  } = useScrollbar(props, {
    mainTableRef,
    leftTableRef,
    rightTableRef,

    onMaybeEndReached,
  })

  const ns = useNamespace('table-v2')
  const instance = getCurrentInstance()!

  // state
  const isScrolling = shallowRef(false)

  const {
    expandedRowKeys,
    lastRenderedRowIndex,
    isDynamic,
    isResetting,
    rowHeights,
    resetAfterIndex,
    onRowExpanded,
    onRowHeightChange,
    onRowHovered,
    onRowsRendered,
  } = useRow(props, {
    mainTableRef,
    leftTableRef,
    rightTableRef,
    tableInstance: instance,
    ns,
    isScrolling,
  })

  const { data, depthMap } = useData(props, {
    expandedRowKeys,
    lastRenderedRowIndex,
    resetAfterIndex,
  })

  const showEmpty = computed(() => {
    const noData = unref(data).length === 0

    return isArray(props.fixedData)
      ? props.fixedData.length === 0 && noData
      : noData
  })

  const rowsHeight = computed(() => {
    const { estimatedRowHeight, rowHeight } = props
    const _data = unref(data)
    if (isNumber(estimatedRowHeight)) {
      // calculate the actual height
      return Object.values(unref(rowHeights)).reduce(
        (acc, curr) => acc + curr,
        0
      )
    }

    return _data.length * rowHeight
  })

  const {
    addRowHeight,
    bodyWidth,
    effectiveHScrollbarSize,
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
  } = useStyles(props, {
    columnsTotalWidth,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    rowsHeight,
    showEmpty,
    effectiveWidth,
    reservedVScrollbarWidth,
  })

  function getRowHeight(rowIndex: number) {
    const { estimatedRowHeight, rowHeight, rowKey } = props

    if (!estimatedRowHeight) return rowHeight

    return (
      unref(rowHeights)[unref(data)[rowIndex][rowKey]] || estimatedRowHeight
    )
  }

  const isEndReached = ref(false)
  function onMaybeEndReached() {
    const { onEndReached } = props
    if (!onEndReached) return

    const { scrollTop } = unref(scrollPos)

    const _totalHeight = unref(rowsHeight)
    const clientHeight = unref(windowHeight)

    const remainDistance =
      _totalHeight - (scrollTop + clientHeight) + unref(effectiveHScrollbarSize)

    if (
      !isEndReached.value &&
      unref(lastRenderedRowIndex) >= 0 &&
      _totalHeight <= scrollTop + unref(mainTableHeight) - unref(headerHeight)
    ) {
      isEndReached.value = true
      onEndReached(remainDistance)
    } else {
      isEndReached.value = false
    }
  }

  // events

  watch(
    () => unref(rowsHeight),
    () => (isEndReached.value = false)
  )

  watch(
    () => props.expandedRowKeys,
    (val) => (expandedRowKeys.value = val),
    {
      deep: true,
    }
  )

  return {
    // models
    columns,
    containerRef,
    mainTableRef,
    leftTableRef,
    rightTableRef,
    // states
    isDynamic,
    isResetting,
    isScrolling,
    hasFixedColumns,
    // records
    columnsStyles,
    columnsTotalWidth,
    data,
    expandedRowKeys,
    depthMap,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    mainColumns,
    visibleColumns,
    // metadata
    addRowHeight,
    bodyWidth,
    emptyStyle,
    effectiveHScrollbarSize,
    rootStyle,
    effectiveWidth,
    footerHeight,
    effectiveFooterHeight,
    mainTableHeight,
    fixedTableHeight,
    leftTableWidth,
    rightTableWidth,
    // flags
    showEmpty,

    // methods
    getRowHeight,

    // event handlers
    updateColumnWidth,
    onColumnSorted,
    onRowHovered,
    onRowExpanded,
    onRowsRendered,
    onRowHeightChange,
    // use scrollbars
    scrollTo,
    scrollToLeft,
    scrollToTop,
    scrollToRow,
    onScroll,
    onVerticalScroll,
    scrollPos,
  }
}

export { useTable }

export type UseTableReturn = ReturnType<typeof useTable>
