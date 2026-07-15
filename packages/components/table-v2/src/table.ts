import { buildProps, definePropType } from '@element-plus/utils'
import {
  virtualizedGridProps,
  virtualizedScrollbarProps,
} from '@element-plus/components/virtual-list'
import {
  classType,
  columns,
  dataType,
  expandKeys,
  fixedDataType,
  optionalNumber,
  rowKey,
} from './common'
import { tableV2RowProps } from './row'
import { tableV2HeaderProps } from './header'
import { tableV2GridProps } from './grid'

import type {
  CSSProperties,
  ExtractPropTypes,
  __ExtractPublicPropTypes,
} from 'vue'
import type { SortOrder } from './constants'
import type {
  Column,
  ColumnCommonParams,
  DataGetter,
  KeyType,
  RowCommonParams,
  SortBy,
  SortState,
} from './types'
import type { RowAddParams, RowDeleteParams } from './row'

/**
 * Param types
 */
export type ColumnSortParams<T> = {
  column: Column<T>
  key: KeyType
  order: SortOrder
}

export type ColumnInsertParams<T> = {
  column: Column<T>
  columnIndex: number
  insertIndex: number
  event: MouseEvent
}

export type RowInsertParams<T> = {
  row: T
  rowIndex: number
  insertIndex: number
  event: MouseEvent
}

export type GhostRowAddParams<T> = {
  row: T
  rowIndex: number
  rowKey: KeyType
  event: MouseEvent
}

/**
 * Renderer/Getter types
 */

export type ExtraCellPropGetter<T> = (
  params: ColumnCommonParams<T> &
    RowCommonParams & { cellData: T; rowData: any }
) => any

export type ExtractHeaderPropGetter<T> = (params: {
  columns: Column<T>[]
  headerIndex: number
}) => any

export type ExtractHeaderCellPropGetter<T> = (
  params: ColumnCommonParams<T> & { headerIndex: number }
) => any

export type ExtractRowPropGetter<T> = (
  params: { columns: Column<T>[] } & RowCommonParams
) => any

export type HeaderClassNameGetter<T> = (params: {
  columns: Column<T>[]
  headerIndex: number
}) => string

export type RowClassNameGetter<T> = (
  params: { columns: Column<T>[] } & RowCommonParams
) => string

/**
 * Handler types
 */
export type ColumnSortHandler<T> = (params: ColumnSortParams<T>) => void
export type ExpandedRowsChangeHandler = (expandedRowKeys: KeyType[]) => void

export const tableV2Emits = {
  'update:expandedRowKeys': (expandedRowKeys: KeyType[]) =>
    Array.isArray(expandedRowKeys),
  'header-dragend': (
    newWidth: number,
    oldWidth: number,
    column: Column<any>,
    event: MouseEvent
  ) =>
    Number.isFinite(newWidth) &&
    Number.isFinite(oldWidth) &&
    Boolean(column) &&
    event instanceof MouseEvent,
  'row-delete': (params: RowDeleteParams) => Boolean(params),
  'row-add': (params: RowAddParams) => Boolean(params),
  'add-column': (params: ColumnInsertParams<any>) => Boolean(params),
  'add-row': (params: RowInsertParams<any>) => Boolean(params),
  'add-ghost-row': (params: GhostRowAddParams<any>) => Boolean(params),
}

export const tableV2Props = buildProps({
  cache: tableV2GridProps.cache,
  estimatedRowHeight: tableV2RowProps.estimatedRowHeight,
  rowKey,
  // Header attributes
  headerClass: {
    type: definePropType<string | HeaderClassNameGetter<any>>([
      String,
      Function,
    ]),
  },
  headerProps: {
    type: definePropType<any | ExtractHeaderPropGetter<any>>([
      Object,
      Function,
    ]),
  },
  headerCellProps: {
    type: definePropType<any | ExtractHeaderCellPropGetter<any>>([
      Object,
      Function,
    ]),
  },
  headerHeight: tableV2HeaderProps.headerHeight,
  /**
   * Footer attributes
   */
  footerHeight: {
    type: Number,
    default: 0,
  },
  isFooterDefault: {
    type: Boolean,
    default: true,
  },
  editable: {
    type: Boolean,
    default: true,
  },
  canEditTable: Boolean,
  ghostTable: Boolean,
  editTable: Boolean,
  ghostRowTemplate: {
    type: definePropType<Record<string, any>>(Object),
    default: () => ({}),
  },
  showAddColumnTrigger: Boolean,
  addColumnButton: {
    type: Boolean,
    default: true,
  },
  showAddRowTrigger: Boolean,
  total: {
    type: Number,
    default: 0,
  },
  updateTime: {
    type: String,
    default: '',
  },
  /**
   * Row attributes
   */
  rowClass: {
    type: definePropType<string | RowClassNameGetter<any>>([String, Function]),
  },
  rowProps: {
    type: definePropType<ExtractRowPropGetter<any> | any>([Object, Function]),
  },
  rowHeight: {
    type: Number,
    default: 44,
  },

  /**
   * Cell attributes
   */
  cellProps: {
    type: definePropType<Record<string, any> | ExtraCellPropGetter<any>>([
      Object,
      Function,
    ]),
  },
  /**
   * Data models
   */
  columns,
  data: dataType,
  dataGetter: {
    type: definePropType<DataGetter<any>>(Function),
  },
  fixedData: fixedDataType,
  /**
   * Expanded keys
   */
  expandColumnKey: tableV2RowProps.expandColumnKey,
  expandedRowKeys: expandKeys,
  defaultExpandedRowKeys: expandKeys,

  /**
   * Attributes
   */
  class: classType,
  // disabled: Boolean,
  fixed: Boolean,
  style: {
    type: definePropType<CSSProperties>(Object),
  },
  width: optionalNumber,
  height: optionalNumber,
  maxHeight: Number,
  useIsScrolling: Boolean,
  indentSize: {
    type: Number,
    default: 12,
  },
  iconSize: {
    type: Number,
    default: 12,
  },
  hScrollbarSize: virtualizedGridProps.hScrollbarSize,
  vScrollbarSize: virtualizedGridProps.vScrollbarSize,
  scrollbarAlwaysOn: virtualizedScrollbarProps.alwaysOn,

  /**
   * Sorting
   */
  sortBy: {
    type: definePropType<SortBy>(Object),
    default: () => ({}) as { key: KeyType; order: SortOrder },
  },
  sortState: {
    type: definePropType<SortState>(Object),
    default: undefined,
  },

  /**
   * Handlers
   */
  onColumnSort: {
    type: definePropType<ColumnSortHandler<any>>(Function),
  },
  onExpandedRowsChange: {
    type: definePropType<ExpandedRowsChangeHandler>(Function),
  },
  onEndReached: {
    type: definePropType<(remainDistance: number) => void>(Function),
  },
  onRowExpand: tableV2RowProps.onRowExpand,
  onScroll: tableV2GridProps.onScroll,
  onRowsRendered: tableV2GridProps.onRowsRendered,
  rowEventHandlers: tableV2RowProps.rowEventHandlers,
} as const)

export type TableV2Props = ExtractPropTypes<typeof tableV2Props>
export type TableV2PropsPublic = __ExtractPublicPropTypes<typeof tableV2Props>
