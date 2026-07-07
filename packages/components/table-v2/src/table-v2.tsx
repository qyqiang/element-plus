import { computed, defineComponent, provide, unref } from 'vue'
import { useNamespace } from '@element-plus/hooks'
import { useTable } from './use-table'
import { rowAddKey, rowAddSign } from './private'
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
      mainTableHeight,
      fixedTableHeight,
      leftTableWidth,
      rightTableWidth,
      data,
      depthMap,
      expandedRowKeys,
      hasFixedColumns,
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

      showEmpty,

      // exposes
      scrollTo,
      scrollToLeft,
      scrollToTop,
      scrollToRow,

      getRowHeight,
      onColumnSorted,
      onRowHeightChange,
      onRowHovered,
      onRowExpanded,
      onRowsRendered,
      onScroll,
      onVerticalScroll,
      scrollPos,
    } = useTable(props)

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
        width,
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
        width,
        getRowHeight,
        onRowsRendered,
        onScroll,
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
        onScroll: onVerticalScroll,
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
        onScroll: onVerticalScroll,
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
      }

      const tableCellProps = {
        canEditTable: props.canEditTable,
        cellProps,
        editable: props.editable,
        expandColumnKey,
        indentSize,
        iconSize,
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
        onColumnSorted,
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
      ]

      const footerProps = {
        class: ns.e('footer'),
        style: unref(footerHeight),
        total: props.total,
        updateTime: props.updateTime,
      }
      const showAddRow = props.canEditTable && props.editable
      const addRowData = {
        [rowKey]: rowAddKey,
        [rowAddSign]: true,
      }
      const addRowHeaderProps = {
        fixedHeaderData: [addRowData],
        headerData: _data,
        headerHeight: [] as number[],
        rowHeight,
        height: unref(addRowHeight),
      }
      const addRowWrapperStyle = {
        bottom: `${props.footerHeight}px`,
      }

      return (
        <div class={rootKls} style={unref(rootStyle)}>
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
                  rowWidth={width}
                  width={width}
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
}
