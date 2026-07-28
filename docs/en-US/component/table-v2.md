---
title: Virtualized Table
lang: en-US
---

# Virtualized Table

Along with evolutionary web development, table component has always been the most popular component in our web apps especially for dashboards, data analysis. For Table V1, with even just 1000 records of data, it can be very annoying when using it, because of the poor performance.

With Virtualized Table, you can render massive chunks of data in a blink of an eye.

## Editable Table

Use `can-edit-table` together with `editable` to reuse each column's `cellRenderer` in the legacy editable mode. This mode appends the built-in delete column and bottom add row, and emits `row-add` / `row-delete` for your own data updates.

:::demo

table-v2/editable-table
:::

## Ghost Table

:::demo Use `ghost-table`, `edit-table`, `ghost-row-template`, and column `editCellRenderer` together with `show-add-column-trigger` and `show-add-row-trigger`. This example now carries the richer editable-table feel as well, mixing checkbox, input, and select editors in the same grid while still keeping the bottom ghost row editable through the same rendering path. The built-in right-side action column now matches Editable Table: regular rows render delete actions there, and the ghost row uses that same column for the built-in add action. Columns marked with `required` automatically drive empty editable renderers into the built-in error state once the ghost row starts receiving values, and the table instance exposes `validateRequiredColumns()` so submit handlers can block incomplete rows. You can also listen to `add-ghost-row` to turn the draft row into real table data while preserving any extra template fields.

table-v2/ghost-table
:::

## Editable rate matrix

This example combines a diagonal route header, editable destination headers and cells, dynamic column insertion, the fixed row action column, and the bottom ghost row in one rate matrix. Use the Input and Select buttons to switch the first-column editor and destination-header editor together.

:::demo

table-v2/rate-matrix

:::

## Custom row action

Use the `row-action` slot to replace the default delete button for regular data rows. The ghost row keeps its built-in add action.

:::demo

table-v2/custom-row-action

:::

## Sorting

Sort the data to find or compare data quickly.

:::demo Set attribute `sortable` in a certain column to sort the data based on this column. It accepts `Boolean` with a default value `false`. Set table attribute `default-sort` to determine default sort column and order. To apply your own sorting rules, use `sort-method` or `sort-by`. If you need remote sorting from backend, set `sortable` to `custom`, and listen to the `sort-change` event on Table. In the event handler, you have access to the sorting column and sorting order so that you can fetch sorted table data from API. In this example we use another attribute named `formatter` to format the value of certain columns. It accepts a function which has two parameters: `row` and `column`. You can handle it according to your own needs.

table-v2/sort

:::

## Default sort state

When a sortable column is not active, its sort icon points down and uses `--color-gray-400`. Clicking cycles through default, ascending, descending, and back to default. An active ascending or descending icon uses `--color-gray-800`.

:::demo The example starts without an active `sort-by` or `sort-state`. Click the sortable header to apply an order and activate the icon.

table-v2/default-sort-state

:::

## Empty data

When `data` is empty in display mode, the empty area uses one `row-height` instead of stretching to fill the remaining table space. In editable mode, Table V2 does not render `el-table-v2__empty`; the editable add row is shown directly instead. Use the example buttons to compare both states.

:::demo

table-v2/empty

:::

## Add column and row trigger

Hover near a header or row divider to show an add button, then insert a new column or row at that position.

:::demo Use `show-add-column-trigger` and `show-add-row-trigger` together with `can-edit-table` and `editable`. The `add-column` and `add-row` events return the insertion position so you can update your own column and row arrays.

table-v2/add-column-trigger

:::

## Resizable columns

Drag the header border to resize a column. After the drag ends, the table emits the `header-dragend` event with the new width, old width, and column config.

:::demo

table-v2/resizable-columns

:::

## Percentage widths

Set `column.width` to a percentage string such as `50%` to size a column against the current table width.

:::demo

table-v2/percentage-widths

:::

## Automatic and mixed column widths

Columns without `width` use the measured header text width plus `48px`, with a minimum width of `80px`. Explicit numeric, pixel, and percentage widths always keep their resolved values. If the columns do not fill the table, only the last widthless column receives the remaining space.

:::demo

table-v2/automatic-column-widths

:::

## Overflow tooltip

Set `showOverflowTooltip` on a column to hide overflowing default cell text and display the complete value in a tooltip on hover. It accepts a boolean or Tooltip options. Columns without this setting keep their original behavior.

:::demo

table-v2/show-overflow-tooltip

:::

## Diagonal header

Use `diagonalHeader` on a column when the first header cell needs both `From` and `To` labels in the same area.

:::demo

table-v2/diagonal-header

:::

## TableV2 API

### TableV2 Attributes

| Name                      | Description                                                                                                                                                                    | Type                                         | Default   |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | --------- |
| cache                     | Number of rows rendered in advance to boost the performance                                                                                                                    | `number`                                     | 2         |
| estimated-row-height      | The estimated row height for rendering dynamic height rows                                                                                                                     | `number`                                     | —         |
| header-class              | Customized class name passed to header wrapper                                                                                                                                 | `string` / `Function<HeaderClassGetter>`     | —         |
| header-props              | Customized props name passed to header component                                                                                                                               | `object` / `Function<HeaderPropsGetter>`     | —         |
| header-cell-props         | Customized props name passed to header cell component                                                                                                                          | `object` / `Function<HeaderCellPropsGetter>` | —         |
| header-height             | The height of the header is set by `height`. If given an array, it renders header rows equal to its length                                                                     | `number`/ `number[]`                         | 44        |
| footer-height             | The height of the footer element, when provided, will be part to the calculation of the table's height.                                                                        | `number`                                     | 0         |
| is-footer-default         | Whether to render the built-in default footer when no `footer` slot is provided                                                                                                | `boolean`                                    | true      |
| can-edit-table            | Whether to enable the legacy editable table mode that reuses `cellRenderer`, appends a delete column, and shows the legacy add row                                             | `boolean`                                    | false     |
| editable                  | Whether the legacy editable table mode should render its editable content                                                                                                      | `boolean`                                    | true      |
| ghost-table               | Whether to enable ghost table rendering with a bottom draft row                                                                                                                | `boolean`                                    | false     |
| edit-table                | Whether to render column `editCellRenderer` output for table rows and the ghost row when `ghost-table` is enabled                                                              | `boolean`                                    | false     |
| ghost-row-template        | Default draft row payload for `ghost-table`. The template is merged into the ghost row, emitted through `add-ghost-row`, and used again when the draft row resets after adding | `object`                                     | `{}`      |
| show-add-column-trigger   | Whether to show an add-column trigger when hovering a header divider                                                                                                           | `boolean`                                    | false     |
| add-column-button         | Whether to show the add-column button in the last header cell when `show-add-column-trigger` is enabled                                                                        | `boolean`                                    | true      |
| show-add-row-trigger      | Whether to show an add-row trigger when hovering a row divider                                                                                                                 | `boolean`                                    | false     |
| total                     | Total value displayed by the built-in default footer                                                                                                                           | `number`                                     | 0         |
| update-time               | Update time displayed by the built-in default footer                                                                                                                           | `string`                                     | ''        |
| row-class                 | Customized class name passed to row wrapper                                                                                                                                    | `string` / `Function<RowClassGetter>`        | —         |
| row-key                   | The key of each row, if not provided, will be the index of the row                                                                                                             | `string` / `Symbol` / `number`               | id        |
| row-props                 | Customized props name passed to row component                                                                                                                                  | `object` / `Function<RowPropsGetter>`        | —         |
| row-height                | The height of each row, used for calculating the total height of the table                                                                                                     | `number`                                     | 44        |
| row-event-handlers        | A collection of handlers attached to each row                                                                                                                                  | `object<RowEventHandlers>`                   | —         |
| cell-props                | extra props passed to each cell (except header cells)                                                                                                                          | `object` / `Function<CellPropsGetter>`       | —         |
| columns                   | An array of column definitions.                                                                                                                                                | [Column[]](#column-attribute)                | —         |
| data                      | An array of data to be rendered in the table.                                                                                                                                  | [Data[]](#typings)                           | []        |
| data-getter               | A method to customize data fetch from the data source.                                                                                                                         | `Function<DataGetter<T>>`                    | —         |
| fixed-data                | Data for rendering rows above the main content and below the header                                                                                                            | `object<Data>`                               | —         |
| expand-column-key         | The column key indicates which row is expandable                                                                                                                               | `string`                                     | —         |
| expanded-row-keys         | An array of keys for expanded rows, can be used with `v-model`                                                                                                                 | [KeyType[]](#typings)                        | —         |
| default-expanded-row-keys | An array of keys for default expanded rows, **NON REACTIVE**                                                                                                                   | [KeyType[]](#typings)                        | —         |
| class                     | Class name for the virtual table, will be applied to all three tables (left, right, main)                                                                                      | `string` / `array` / `object`                | —         |
| fixed                     | Flag indicates the table column's width to be fixed or flexible.                                                                                                               | `boolean`                                    | false     |
| width                     | Width of the table. When omitted, the table root defaults to `100%` and uses the rendered container width for layout                                                           | `number`                                     | `100%`    |
| height                    | Height of the table. When omitted, the table grows with its content. Use `max-height` by itself to let the table auto-size until it reaches the limit                          | `number`                                     | auto      |
| max-height                | Maximum height of the table. When `height` is omitted, the table auto-sizes up to this value and then shows scrollbars                                                         | `number`                                     | —         |
| indent-size               | horizontal indentation of tree table                                                                                                                                           | `number`                                     | 12        |
| h-scrollbar-size          | Indicates the horizontal scrollbar's size for the table, used to prevent the horizontal and vertical scrollbar to collapse                                                     | `number`                                     | 6         |
| v-scrollbar-size          | Indicates the vertical scrollbar's size for the table, used to prevent the horizontal and vertical scrollbar to collapse                                                       | `number`                                     | 6         |
| scrollbar-always-on       | If true, the scrollbar will always be shown instead of when mouse is placed above the table                                                                                    | `boolean`                                    | false     |
| sort-by                   | Sort indicator                                                                                                                                                                 | `object<SortBy>`                             | {}        |
| sort-state                | Multiple sort indicator                                                                                                                                                        | `object<SortState>`                          | undefined |

### TableV2 Slots

| Name        | Params                        |
| ----------- | ----------------------------- |
| cell        | `object<CellSlotProps>`       |
| header      | `object<HeaderSlotProps>`     |
| header-cell | `object<HeaderCellSlotProps>` |
| row         | `object<RowSlotProps>`        |
| row-action  | `object<RowActionSlotProps>`  |
| footer      | —                             |
| empty       | —                             |
| overlay     | —                             |

### TableV2 Events

| Name                 | Description                                                                                                                     | Parameters                                    |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| column-sort          | Invoked when column sorted                                                                                                      | `object<ColumnSortParam>`                     |
| expanded-rows-change | Invoked when expanded rows changed                                                                                              | [KeyType[]](#typings)                         |
| end-reached          | Invoked when the end of the table is reached. The callback contain the remain distance, it is the usually the scrollbar height. | ^[Function]`(remainDistance: number) => void` |
| scroll               | Invoked after scrolling                                                                                                         | `object<ScrollParams>`                        |
| rows-rendered        | Invoked when rows are rendered                                                                                                  | `object<RowsRenderedParams>`                  |
| row-expand           | Invoked when expand/collapse the tree node by clicking the arrow icon                                                           | `object<RowExpandParams>`                     |
| header-dragend       | Invoked after a resizable header drag ends                                                                                      | `number, number, Column, MouseEvent`          |
| add-column           | Invoked when the add-column button on a header divider or the last header cell is clicked                                       | `object<ColumnInsertParams>`                  |
| add-row              | Invoked when the add-row button on a row divider is clicked                                                                     | `object<RowInsertParams>`                     |
| add-ghost-row        | Invoked when the built-in add action in the ghost row is clicked                                                                | `object<GhostRowAddParams>`                   |
| row-add              | Invoked when the editable ghost row or its action button is clicked                                                             | `object<RowAddParams>`                        |
| row-delete           | Invoked when the editable delete action is clicked                                                                              | `object<RowDeleteParams>`                     |

### TableV2 Exposes

| Method                  | Description                                                                                                 | Parameters                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| scrollTo                | Scroll to a given position                                                                                  | ^[Function]`(param: {scrollLeft?: number, scrollTop?: number}) => void`                |
| scrollToLeft            | Scroll to a given horizontal position                                                                       | ^[Function]`(scrollLeft: number) => void`                                              |
| scrollToTop             | Scroll to a given vertical position                                                                         | ^[Function]`(scrollTop: number) => void`                                               |
| scrollToRow             | scroll to a given row with specified scroll strategy                                                        | ^[Function]`(row: number, strategy?: 'center' \| 'end' \| 'start' \| 'smart') => void` |
| validateRequiredColumns | validates current table data against `required` columns and returns `false` when any required cell is empty | ^[Function]`() => boolean`                                                             |

:::tip

Note that these are `JavaScript` Objects, so you **CANNOT USE** kebab-case for these attributes

:::

### Column Attribute

| Name                         | Description                                                                                                                                                                                                                                                       | Type                                                 | Default |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------- |
| align                        | Alignment of the table cell content                                                                                                                                                                                                                               | Alignment                                            | left    |
| class                        | Class name for the column                                                                                                                                                                                                                                         | `string`                                             | —       |
| key                          | Unique identification                                                                                                                                                                                                                                             | KeyType                                              | —       |
| dataKey                      | Unique identification of data                                                                                                                                                                                                                                     | KeyType                                              | —       |
| fixed                        | Fixed direction of the column                                                                                                                                                                                                                                     | `boolean` / FixedDir                                 | false   |
| flexGrow                     | CSSProperties flex grow, Only useful when this is not a fixed table                                                                                                                                                                                               | `number`                                             | 0       |
| flexShrink                   | CSSProperties flex shrink, Only useful when this is not a fixed table                                                                                                                                                                                             | `number`                                             | 1       |
| headerClass                  | Used for customizing header column class                                                                                                                                                                                                                          | `string`                                             | —       |
| hidden                       | Whether the column is invisible                                                                                                                                                                                                                                   | `boolean`                                            | —       |
| diagonalHeader               | Renders a diagonal header layout in the column header cell                                                                                                                                                                                                        | `object<{ from: string; to: string }>`               | —       |
| allowInsertBeforeFirstColumn | Whether the first column can show an add-column trigger on the left half of its header to insert before itself                                                                                                                                                    | `boolean`                                            | true    |
| style                        | Customized style for column cell, will be merged with grid cell                                                                                                                                                                                                   | ^[object]`CSSProperties`                             | —       |
| sortable                     | Indicates whether the column is sortable                                                                                                                                                                                                                          | `boolean`                                            | —       |
| required                     | Whether to add the `required-column` class to the column header and cells                                                                                                                                                                                         | `boolean`                                            | false   |
| resizable                    | Whether the column can be resized by dragging the header border                                                                                                                                                                                                   | `boolean`                                            | true    |
| showOverflowTooltip          | Whether to show a tooltip when this column's default cell text overflows. Also accepts Tooltip options                                                                                                                                                            | `boolean` / `object`                                 | —       |
| title                        | The default text rendered in header cell                                                                                                                                                                                                                          | `string`                                             | —       |
| maxWidth                     | Maximum width for the column                                                                                                                                                                                                                                      | `number`                                             | —       |
| minWidth                     | Minimum width for the column                                                                                                                                                                                                                                      | `number`                                             | —       |
| width                        | Width for the column. Supports pixel numbers and percentage strings like `50%`. Explicit widths keep their resolved values. If omitted, columns use header text width plus `48px` with an `80px` minimum, and the last widthless column fills the remaining space | `number` / `string`                                  | auto    |
| cellRenderer                 | Customized Cell renderer                                                                                                                                                                                                                                          | `VueComponent` / (props: CellRenderProps) => VNode   | —       |
| editCellRenderer             | Customized editable cell renderer used by `ghost-table` + `edit-table`                                                                                                                                                                                            | `VueComponent` / (props: CellRenderProps) => VNode   | —       |
| headerCellRenderer           | Customized Header renderer                                                                                                                                                                                                                                        | `VueComponent` / (props: HeaderRenderProps) => VNode | —       |

## Typings{#typings}

<details>
<summary>Show Type Declarations</summary>

```ts
type HeaderClassGetter = (param: {
  columns: Column<any>[]
  headerIndex: number
}) => string

type HeaderPropsGetter = (param: {
  columns: Column<any>[]
  headerIndex: number
}) => Record<string, any>

type HeaderCellPropsGetter = (param: {
  columns: Column<any>[]
  column: Column<any>
  columnIndex: number
  headerIndex: number
  style: CSSProperties
}) => Record<string, any>

type RowClassGetter = (param: {
  columns: Column<any>[]
  rowData: any
  rowIndex: number
}) => string

type RowPropsGetter = (param: {
  columns: Column<any>[]
  rowData: any
  rowIndex: number
}) => Record<string, any>

type CellPropsGetter = (param: {
  column: Column<any>
  columns: Column<any>[]
  columnIndex: number
  cellData: any
  rowData: any
  rowIndex: number
}) => void

type DataGetterParams<T> = {
  columns: Column<T>[]
  column: Column<T>
  columnIndex: number
} & RowCommonParams

type DataGetter<T> = (params: DataGetterParams<T>) => T

type ColumnInsertParams<T> = {
  column: Column<T>
  columnIndex: number
  insertIndex: number
  event: MouseEvent
}

type RowInsertParams<T> = {
  row: T
  rowIndex: number
  insertIndex: number
  event: MouseEvent
}

type GhostRowAddParams<T> = {
  row: T
  rowIndex: number
  rowKey: KeyType
  event: MouseEvent
}

type CellRenderProps<T> = {
  cellData: T
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  rowData: any
  rowIndex: number
}

type HeaderRenderProps<T> = {
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  headerIndex: number
}

type ScrollParams = {
  xAxisScrollDir: 'forward' | 'backward'
  scrollLeft: number
  yAxisScrollDir: 'forward' | 'backward'
  scrollTop: number
}

type CellSlotProps<T> = {
  column: Column<T>
  columns: Column<T>[]
  columnIndex: number
  depth: number
  style: CSSProperties
  rowData: any
  rowIndex: number
  isScrolling: boolean
  expandIconProps?:
    | {
        rowData: any
        rowIndex: number
        onExpand: (expand: boolean) => void
      }
    | undefined
}

type HeaderSlotProps = {
  cells: VNode[]
  columns: Column<any>[]
  headerIndex: number
}

type HeaderCellSlotProps = {
  class: string
  columns: Column<any>[]
  column: Column<any>
  columnIndex: number
  headerIndex: number
  style: CSSProperties
  headerCellProps?: any
  sortBy: SortBy
  sortState?: SortState | undefined
  onColumnSorted: (e: MouseEvent) => void
  updateColumnWidth: (column: Column<any>, width: number) => void
  onHeaderDragend?: (
    newWidth: number,
    oldWidth: number,
    column: Column<any>,
    event: MouseEvent
  ) => void
}

type RowCommonParams = {
  rowData: any
  rowIndex: number
}

type RowActionSlotProps = {
  columns: Column<any>[]
  column: Column<any>
  columnIndex: number
  rowData: any
  rowIndex: number
  rowKey: KeyType
}

type RowEventHandlerParams = {
  rowKey: KeyType
  event: Event
} & RowCommonParams

type RowEventHandler = (params: RowEventHandlerParams) => void
type RowEventHandlers = {
  onClick?: RowEventHandler
  onContextmenu?: RowEventHandler
  onDblclick?: RowEventHandler
  onMouseenter?: RowEventHandler
  onMouseleave?: RowEventHandler
}

type RowsRenderedParams = {
  rowCacheStart: number
  rowCacheEnd: number
  rowVisibleStart: number
  rowVisibleEnd: number
}

type RowSlotProps = {
  columns: Column<any>[]
  rowData: any
  columnIndex: number
  rowIndex: number
  data: any
  key: number | string
  isScrolling?: boolean
  style: CSSProperties
}

type RowExpandParams = {
  expanded: boolean
  rowKey: KeyType
} & RowCommonParams

type RowAddParams = {
  event: MouseEvent
  rowKey: KeyType
} & RowCommonParams

type RowDeleteParams = {
  event: MouseEvent
  rowKey: KeyType
} & RowCommonParams

type Data = {
  [key: KeyType]: any
  children?: Array<any>
}

type FixedData = Data

type KeyType = string | number | symbol

type ColumnSortParam<T> = { column: Column<T>; key: KeyType; order: SortOrder }

enum SortOrder {
  DEFAULT = '',
  ASC = 'asc',
  DESC = 'desc',
}

enum Alignment {
  LEFT = 'left',
  CENTER = 'center',
  RIGHT = 'right',
}

type SortBy = { key: KeyType; Order: SortOrder }
type SortState = Record<KeyType, SortOrder>
```

</details>
