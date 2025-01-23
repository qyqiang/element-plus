import { withInstall, withNoopInstall } from '@element-plus/utils'
import Table from './src/table.vue'
import TableColumn from './src/tableColumn'
import TableEditableCell from './src/table-editable-cell.vue'
import type { SFCWithInstall } from '@element-plus/utils'

export const ElTable: SFCWithInstall<typeof Table> & {
  TableColumn: typeof TableColumn
} = withInstall(Table, {
  TableColumn,
})
export default ElTable
export const ElTableColumn: SFCWithInstall<typeof TableColumn> =
  withNoopInstall(TableColumn)

export const ElTableEditableCell: SFCWithInstall<typeof TableEditableCell> =
  withNoopInstall(TableEditableCell)

export type TableInstance = InstanceType<typeof Table>

export type TableColumnInstance = InstanceType<typeof TableColumn>

export type {
  SummaryMethod,
  Table,
  TableProps,
  TableRefs,
  ColumnCls,
  ColumnStyle,
  CellCls,
  CellStyle,
  TreeNode,
  RenderRowData,
  Sort,
  Filter,
  TableColumnCtx,
} from './src/table/defaults'
