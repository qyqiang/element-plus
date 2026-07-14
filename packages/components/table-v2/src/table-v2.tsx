import {
  computed,
  defineComponent,
  provide,
  ref,
  shallowRef,
  unref,
  watch,
} from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { useTable } from './use-table'
import {
  ghostRowFieldKey,
  ghostRowKey,
  ghostRowSign,
  rowAddKey,
  rowAddSign,
} from './private'
import ElButton from '@element-plus/components/button'
import ElIcon from '@element-plus/components/icon'
import ElTooltip from '@element-plus/components/tooltip'
import { isEmptyRequiredValue } from './ghost-table'
import { TABLE_V2_GRID_INJECTION_KEY, TableV2InjectionKey } from './tokens'
import { tableV2Emits, tableV2Props } from './table'
// renderers
import MainTable from './renderers/main-table'
import LeftTable from './renderers/left-table'
import RightTable from './renderers/right-table'
import Row from './renderers/row'
import Cell from './renderers/cell'
import HeaderRenderer from './renderers/header'
import HeaderCell from './renderers/header-cell'
import Footer from './renderers/footer'
import FooterDefault from './renderers/footerDefault'
import Empty from './renderers/empty'
import Overlay from './renderers/overlay'
import { Header } from './components'

import type { CSSProperties } from 'vue'
import type { TableGridRowSlotParams } from './table-grid'
import type { ScrollStrategy } from './composables/use-scrollbar'
import type {
  TableV2HeaderRendererParams,
  TableV2HeaderRowCellRendererParams,
  TableV2RowCellRenderParam,
} from './components'
import type { KeyType } from './types'
import type { RowAddHandler, RowDeleteHandler } from './row'
import type {
  ColumnInsertParams,
  GhostRowAddParams,
  RowInsertParams,
} from './table'

type AddColumnTrigger = Omit<ColumnInsertParams<any>, 'event'> & {
  left: number
}

type AddRowTrigger = Omit<RowInsertParams<any>, 'event'> & {
  top: number
  placement: 'above' | 'below'
}

const COMPONENT_NAME = 'ElTableV2'

const TableV2 = defineComponent({
  name: COMPONENT_NAME,
  props: tableV2Props,
  emits: tableV2Emits,
  setup(props, { slots, expose, emit }) {
    const ns = useNamespace('table-v2')

    const {
      columnsStyles,
      fixedColumnsOnLeft,
      fixedColumnsOnRight,
      mainColumns,
      visibleColumns,
      mainTableHeight,
      fixedTableHeight,
      leftTableWidth,
      rightTableWidth,
      data,
      depthMap,
      expandedRowKeys,
      hasFixedColumns,
      containerRef,
      mainTableRef,
      leftTableRef,
      rightTableRef,
      isDynamic,
      isResetting,
      isScrolling,

      bodyWidth,
      addRowHeight,
      emptyStyle,
      rootStyle,
      footerHeight,
      effectiveFooterHeight,
      effectiveWidth,

      showEmpty,

      // exposes
      scrollTo,
      scrollToLeft,
      scrollToTop,
      scrollToRow,

      getRowHeight,
      updateColumnWidth,
      onColumnSorted,
      onRowHeightChange,
      onRowHovered,
      onRowExpanded,
      onRowsRendered,
      onScroll,
      onVerticalScroll,
      scrollPos,
    } = useTable(props)

    const addColumnTrigger = shallowRef<AddColumnTrigger | null>(null)
    const addRowTrigger = ref<AddRowTrigger | null>(null)
    const createGhostRowData = () => ({
      [props.rowKey]: 'ghost-row',
      [ghostRowKey]: 'ghost-row',
      [ghostRowFieldKey]: props.rowKey,
      [ghostRowSign]: true,
    })
    const ghostRowDraft = ref(createGhostRowData())
    const isLegacyEditMode = computed(
      () => props.canEditTable && props.editable
    )
    const isGhostEditMode = computed(() => props.ghostTable && props.editTable)

    const clearAddColumnTrigger = () => {
      addColumnTrigger.value = null
    }

    const updateAddColumnTrigger = (payload: AddColumnTrigger | null) => {
      addColumnTrigger.value = payload
    }

    const clearAddRowTrigger = () => {
      addRowTrigger.value = null
    }

    const updateAddRowTrigger = (payload: AddRowTrigger | null) => {
      addRowTrigger.value = payload
    }

    const handleAddColumnClick = (event: MouseEvent) => {
      const trigger = addColumnTrigger.value
      if (!trigger) return
      emit('add-column', {
        column: trigger.column,
        columnIndex: trigger.columnIndex,
        insertIndex: trigger.insertIndex,
        event,
      })
      clearAddColumnTrigger()
    }

    const handleAddColumnTailClick = (payload: ColumnInsertParams<any>) => {
      emit('add-column', payload)
      clearAddColumnTrigger()
    }

    const handleAddRowClick = (event: MouseEvent) => {
      const trigger = addRowTrigger.value
      if (!trigger) return

      emit('add-row', {
        row: trigger.row,
        rowIndex: trigger.rowIndex,
        insertIndex: trigger.insertIndex,
        event,
      })
      clearAddRowTrigger()
    }

    const handleTableMouseLeave = () => {
      clearAddColumnTrigger()
      clearAddRowTrigger()
    }

    const validateRequiredColumns = () => {
      const requiredColumns = props.columns.filter(
        (column) => column.required && column.dataKey != null
      )

      if (!requiredColumns.length) return true

      return props.data.every((row) =>
        requiredColumns.every(
          (column) =>
            !isEmptyRequiredValue(row?.[column.dataKey as keyof typeof row])
        )
      )
    }

    const handleTableScroll = (params: Parameters<typeof onScroll>[0]) => {
      clearAddColumnTrigger()
      clearAddRowTrigger()
      onScroll(params)
    }

    const handleVerticalTableScroll = (
      params: Parameters<typeof onVerticalScroll>[0]
    ) => {
      clearAddColumnTrigger()
      clearAddRowTrigger()
      onVerticalScroll(params)
    }

    const effectiveShowAddColumnTrigger = computed(
      () =>
        (isLegacyEditMode.value || isGhostEditMode.value) &&
        props.showAddColumnTrigger
    )

    const effectiveShowAddRowTrigger = computed(
      () =>
        (isLegacyEditMode.value || isGhostEditMode.value) &&
        props.showAddRowTrigger
    )

    const addColumnTriggerStyle = computed<CSSProperties>(() => {
      if (!addColumnTrigger.value) return {}

      return {
        left: `${addColumnTrigger.value.left}px`,
      }
    })

    const addRowTriggerStyle = computed<CSSProperties>(() => {
      if (!addRowTrigger.value) return {}

      return {
        top: `${addRowTrigger.value.top}px`,
      }
    })

    watch(effectiveShowAddColumnTrigger, (enabled: boolean) => {
      if (!enabled) clearAddColumnTrigger()
    })

    watch(effectiveShowAddRowTrigger, (enabled: boolean) => {
      if (!enabled) clearAddRowTrigger()
    })

    expose({
      /**
       * @description scroll to a given position
       * @params params {{ scrollLeft?: number, scrollTop?: number }} where to scroll to.
       */
      scrollTo,
      /**
       * @description scroll to a given position horizontally
       * @params scrollLeft {Number} where to scroll to.
       */
      scrollToLeft,
      /**
       * @description scroll to a given position vertically
       * @params scrollTop { Number } where to scroll to.
       */
      scrollToTop,
      /**
       * @description scroll to a given row
       * @params row {Number} which row to scroll to
       * @params @optional strategy {ScrollStrategy} use what strategy to scroll to
       */
      scrollToRow,
      validateRequiredColumns,
    })

    provide(TableV2InjectionKey, {
      ns,
      isResetting,
      isScrolling,
    })
    provide(
      TABLE_V2_GRID_INJECTION_KEY,
      computed(() => unref(scrollPos).scrollLeft)
    )

    const onRowDelete: RowDeleteHandler = (params) => {
      emit('row-delete', params)
    }
    const onRowAdd: RowAddHandler = (params) => {
      emit('row-add', params)
    }
    const onAddGhostRow = (params: GhostRowAddParams<any>) => {
      emit('add-ghost-row', params)
    }
    const onHeaderDragend = (
      newWidth: number,
      oldWidth: number,
      column: TableV2HeaderRowCellRendererParams['column'],
      event: MouseEvent
    ) => {
      emit('header-dragend', newWidth, oldWidth, column, event)
    }

    return () => {
      const {
        cache,
        cellProps,
        estimatedRowHeight,
        expandColumnKey,
        fixedData,
        headerHeight,
        headerClass,
        headerProps,
        headerCellProps,
        sortBy,
        sortState,
        rowHeight,
        rowClass,
        rowEventHandlers,
        rowKey,
        rowProps,
        scrollbarAlwaysOn,
        indentSize,
        iconSize,
        useIsScrolling,
        vScrollbarSize,
      } = props

      const _data = unref(data)

      const mainTableProps = {
        cache,
        class: ns.e('main'),
        columns: unref(mainColumns),
        data: _data,
        fixedData,
        estimatedRowHeight,
        bodyWidth: unref(bodyWidth),
        headerHeight,
        headerWidth: unref(bodyWidth),
        height: unref(mainTableHeight),
        mainTableRef,
        rowKey,
        rowHeight,
        scrollbarAlwaysOn,
        scrollbarStartGap: 2,
        scrollbarEndGap: vScrollbarSize,
        useIsScrolling,
        width: unref(effectiveWidth),
        getRowHeight,
        onRowsRendered,
        onScroll: handleTableScroll,
      }

      const leftColumnsWidth = unref(leftTableWidth)
      const _fixedTableHeight = unref(fixedTableHeight)

      const leftTableProps = {
        cache,
        class: ns.e('left'),
        columns: unref(fixedColumnsOnLeft),
        data: _data,
        fixedData,
        estimatedRowHeight,
        leftTableRef,
        rowHeight,
        bodyWidth: leftColumnsWidth,
        headerWidth: leftColumnsWidth,
        headerHeight,
        height: _fixedTableHeight,
        rowKey,
        scrollbarAlwaysOn,
        scrollbarStartGap: 2,
        scrollbarEndGap: vScrollbarSize,
        useIsScrolling,
        width: leftColumnsWidth,
        getRowHeight,
        onScroll: handleVerticalTableScroll,
      }

      const rightColumnsWidth = unref(rightTableWidth)

      const rightTableProps = {
        cache,
        class: ns.e('right'),
        columns: unref(fixedColumnsOnRight),
        data: _data,
        fixedData,
        estimatedRowHeight,
        rightTableRef,
        rowHeight,
        bodyWidth: rightColumnsWidth,
        headerWidth: rightColumnsWidth,
        headerHeight,
        height: _fixedTableHeight,
        rowKey,
        scrollbarAlwaysOn,
        scrollbarStartGap: 2,
        scrollbarEndGap: vScrollbarSize,
        width: rightColumnsWidth,
        style: `${ns.cssVarName(
          'table-scrollbar-size'
        )}: ${vScrollbarSize}px` as unknown as CSSProperties,
        useIsScrolling,
        getRowHeight,
        onScroll: handleVerticalTableScroll,
      }
      const _columnsStyles = unref(columnsStyles)

      const tableRowProps = {
        ns,
        depthMap: unref(depthMap),
        columnsStyles: _columnsStyles,
        expandColumnKey,
        expandedRowKeys: unref(expandedRowKeys),
        estimatedRowHeight,
        hasFixedColumns: unref(hasFixedColumns),
        rowProps,
        rowClass,
        rowKey,
        rowEventHandlers,
        onRowAdd,
        onRowHovered,
        onRowExpanded,
        onRowHeightChange,
        onAddRowTriggerChange: updateAddRowTrigger,
        canEditTable: props.canEditTable,
        editable: props.editable,
        editTable: props.editTable,
        ghostTable: props.ghostTable,
        showAddRowTrigger: effectiveShowAddRowTrigger.value,
      }

      const tableCellProps = {
        canEditTable: props.canEditTable,
        cellProps,
        editable: props.editable,
        editTable: props.editTable,
        expandColumnKey,
        ghostTable: props.ghostTable,
        indentSize,
        iconSize,
        onAddGhostRow,
        onRowAdd,
        onRowDelete,
        rowKey,
        expandedRowKeys: unref(expandedRowKeys),
        ns,
      }

      const tableHeaderProps = {
        ns,
        headerClass,
        headerProps,
        columnsStyles: _columnsStyles,
      }

      const tableHeaderCellProps = {
        ns,
        sortBy,
        sortState,
        headerCellProps,
        canEditTable: props.canEditTable,
        editable: props.editable,
        editTable: props.editTable,
        ghostTable: props.ghostTable,
        showAddColumnTrigger: effectiveShowAddColumnTrigger.value,
        addColumnButton: props.addColumnButton,
        onHeaderDragend,
        onAddColumnTriggerChange: updateAddColumnTrigger,
        onTailAddColumn: handleAddColumnTailClick,
        onColumnSorted,
        updateColumnWidth,
        visibleColumns: unref(visibleColumns),
      }

      const tableSlots = {
        row: (props: TableGridRowSlotParams) => (
          <Row {...props} {...tableRowProps}>
            {{
              row: slots.row,
              cell: (props: TableV2RowCellRenderParam) =>
                slots.cell ? (
                  <Cell
                    {...props}
                    {...tableCellProps}
                    style={_columnsStyles[props.column.key as KeyType]}
                  >
                    {slots.cell(props)}
                  </Cell>
                ) : (
                  <Cell
                    {...props}
                    {...tableCellProps}
                    style={_columnsStyles[props.column.key as KeyType]}
                  />
                ),
            }}
          </Row>
        ),
        header: (props: TableV2HeaderRendererParams) => (
          <HeaderRenderer {...props} {...tableHeaderProps}>
            {{
              header: slots.header,
              cell: (props: TableV2HeaderRowCellRendererParams) =>
                slots['header-cell'] ? (
                  <HeaderCell
                    {...props}
                    {...tableHeaderCellProps}
                    style={_columnsStyles[props.column.key as KeyType]}
                  >
                    {slots['header-cell'](props)}
                  </HeaderCell>
                ) : (
                  <HeaderCell
                    {...props}
                    {...tableHeaderCellProps}
                    style={_columnsStyles[props.column.key as KeyType]}
                  />
                ),
            }}
          </HeaderRenderer>
        ),
      }

      const rootKls = [
        props.class,
        ns.b(),
        ns.e('root'),
        ns.is('dynamic', unref(isDynamic)),
        effectiveShowAddColumnTrigger.value && ns.m('with-add-column-trigger'),
        effectiveShowAddRowTrigger.value && ns.m('with-add-row-trigger'),
      ]

      const footerProps = {
        class: ns.e('footer'),
        style: unref(footerHeight),
        total: props.total,
        updateTime: props.updateTime,
      }
      const showAddRow = isLegacyEditMode.value && !isGhostEditMode.value
      const showGhostRow = isGhostEditMode.value
      const addRowData = {
        [rowKey]: rowAddKey,
        [rowAddSign]: true,
      }
      const ghostRowData = unref(ghostRowDraft)
      const addRowHeaderProps = {
        fixedHeaderData: [addRowData],
        headerData: _data,
        headerHeight: [] as number[],
        rowHeight,
        height: unref(addRowHeight),
      }
      const ghostRowHeaderProps = {
        fixedHeaderData: [ghostRowData],
        headerData: _data,
        headerHeight: [] as number[],
        rowHeight,
        height: unref(addRowHeight),
      }
      const addRowWrapperStyle = {
        bottom: `${unref(effectiveFooterHeight)}px`,
      }

      return (
        <div
          ref={containerRef}
          class={rootKls}
          style={unref(rootStyle)}
          onMouseleave={handleTableMouseLeave}
        >
          <MainTable {...mainTableProps}>{tableSlots}</MainTable>
          <LeftTable {...leftTableProps}>{tableSlots}</LeftTable>
          <RightTable {...rightTableProps}>{tableSlots}</RightTable>
          {showAddRow && (
            <>
              <div class={ns.e('add-row-main')} style={addRowWrapperStyle}>
                <Header
                  {...addRowHeaderProps}
                  {...tableHeaderProps}
                  columns={unref(mainColumns)}
                  class={ns.e('add-row-main-inner')}
                  rowWidth={unref(effectiveWidth)}
                  width={unref(effectiveWidth)}
                >
                  {{
                    fixed: tableSlots.row,
                  }}
                </Header>
              </div>
              {leftColumnsWidth > 0 && (
                <div class={ns.e('add-row-left')} style={addRowWrapperStyle}>
                  <Header
                    {...addRowHeaderProps}
                    {...tableHeaderProps}
                    columns={unref(fixedColumnsOnLeft)}
                    class={ns.e('add-row-left-inner')}
                    rowWidth={leftColumnsWidth}
                    width={leftColumnsWidth}
                  >
                    {{
                      fixed: tableSlots.row,
                    }}
                  </Header>
                </div>
              )}
              {rightColumnsWidth > 0 && (
                <div class={ns.e('add-row-right')} style={addRowWrapperStyle}>
                  <Header
                    {...addRowHeaderProps}
                    {...tableHeaderProps}
                    columns={unref(fixedColumnsOnRight)}
                    class={ns.e('add-row-right-inner')}
                    rowWidth={rightColumnsWidth}
                    width={rightColumnsWidth}
                  >
                    {{
                      fixed: tableSlots.row,
                    }}
                  </Header>
                </div>
              )}
            </>
          )}
          {showGhostRow && (
            <>
              <div class={ns.e('add-row-main')} style={addRowWrapperStyle}>
                <Header
                  {...ghostRowHeaderProps}
                  {...tableHeaderProps}
                  columns={unref(mainColumns)}
                  class={ns.e('add-row-main-inner')}
                  rowWidth={unref(effectiveWidth)}
                  width={unref(effectiveWidth)}
                >
                  {{
                    fixed: tableSlots.row,
                  }}
                </Header>
              </div>
              {leftColumnsWidth > 0 && (
                <div class={ns.e('add-row-left')} style={addRowWrapperStyle}>
                  <Header
                    {...ghostRowHeaderProps}
                    {...tableHeaderProps}
                    columns={unref(fixedColumnsOnLeft)}
                    class={ns.e('add-row-left-inner')}
                    rowWidth={leftColumnsWidth}
                    width={leftColumnsWidth}
                  >
                    {{
                      fixed: tableSlots.row,
                    }}
                  </Header>
                </div>
              )}
              {rightColumnsWidth > 0 && (
                <div class={ns.e('add-row-right')} style={addRowWrapperStyle}>
                  <Header
                    {...ghostRowHeaderProps}
                    {...tableHeaderProps}
                    columns={unref(fixedColumnsOnRight)}
                    class={ns.e('add-row-right-inner')}
                    rowWidth={rightColumnsWidth}
                    width={rightColumnsWidth}
                  >
                    {{
                      fixed: tableSlots.row,
                    }}
                  </Header>
                </div>
              )}
            </>
          )}
          {slots.footer ? (
            <Footer {...footerProps}>{{ default: slots.footer }}</Footer>
          ) : props.isFooterDefault ? (
            <FooterDefault {...footerProps}>
              {{ default: slots.footer }}
            </FooterDefault>
          ) : null}
          {unref(showEmpty) && (
            <Empty class={ns.e('empty')} style={unref(emptyStyle)}>
              {{ default: slots.empty }}
            </Empty>
          )}
          {slots.overlay && (
            <Overlay class={ns.e('overlay')}>
              {{ default: slots.overlay }}
            </Overlay>
          )}
          {effectiveShowAddColumnTrigger.value && addColumnTrigger.value && (
            <div
              class={ns.e('add-column-trigger')}
              style={unref(addColumnTriggerStyle)}
            >
              <ElTooltip content={'Add Column'} placement={'top'}>
                <ElButton
                  class={[ns.e('add-column-trigger-button'), 'icon-button']}
                  onClick={handleAddColumnClick}
                >
                  <ElIcon color={'#2A3F4D'} size={'12px'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                    >
                      <g clip-path="url(#clip0_35669_24470)">
                        <path d="M12 5.25H6.75V0H5.25V5.25H0V6.75H5.25V12H6.75V6.75H12V5.25Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_35669_24470">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </ElIcon>
                </ElButton>
              </ElTooltip>
            </div>
          )}
          {effectiveShowAddRowTrigger.value && addRowTrigger.value && (
            <div
              class={ns.e('add-row-trigger')}
              style={unref(addRowTriggerStyle)}
            >
              <ElTooltip content={'Add Row'} placement={'top'}>
                <ElButton
                  class={[ns.e('add-row-trigger-button'), 'icon-button']}
                  aria-label={'Add Row'}
                  onClick={handleAddRowClick}
                >
                  <ElIcon color={'#2A3F4D'} size={'12px'}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                    >
                      <g clip-path="url(#clip0_35669_24470)">
                        <path d="M12 5.25H6.75V0H5.25V5.25H0V6.75H5.25V12H6.75V6.75H12V5.25Z" />
                      </g>
                      <defs>
                        <clipPath id="clip0_35669_24470">
                          <rect width="12" height="12" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </ElIcon>
                </ElButton>
              </ElTooltip>
            </div>
          )}
        </div>
      )
    }
  },
})

export default TableV2

export type TableV2Instance = InstanceType<typeof TableV2> & {
  /**
   * @description scroll to a given position
   * @params params {{ scrollLeft?: number, scrollTop?: number }} where to scroll to.
   */
  scrollTo: (param: { scrollLeft?: number; scrollTop?: number }) => void
  /**
   * @description scroll to a given position horizontally
   * @params scrollLeft {Number} where to scroll to.
   */
  scrollToLeft: (scrollLeft: number) => void
  /**
   * @description scroll to a given position vertically
   * @params scrollTop { Number } where to scroll to.
   */
  scrollToTop: (scrollTop: number) => void
  /**
   * @description scroll to a given row
   * @params row {Number} which row to scroll to
   * @params strategy {ScrollStrategy} use what strategy to scroll to
   */
  scrollToRow(row: number, strategy?: ScrollStrategy): void
  /**
   * @description validates current table data against required columns
   */
  validateRequiredColumns: () => boolean
}
