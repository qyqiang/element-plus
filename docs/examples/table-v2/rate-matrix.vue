<template>
  <div class="rate-matrix-demo">
    <div class="rate-matrix-demo__toolbar">
      <el-button @click="handleImport">Import</el-button>
      <el-button @click="handleExport">Export</el-button>
      <el-button @click="appendRateColumn">Add Column</el-button>
      <el-button-group>
        <el-button
          :type="editorMode === 'input' ? 'primary' : undefined"
          @click="editorMode = 'input'"
        >
          Input
        </el-button>
        <el-button
          :type="editorMode === 'select' ? 'primary' : undefined"
          @click="editorMode = 'select'"
        >
          Select
        </el-button>
      </el-button-group>
    </div>

    <el-table-v2
      :columns="columns"
      :data="tableData"
      :width="900"
      :height="560"
      fixed
      ghost-table
      edit-table
      show-add-column-trigger
      :ghost-row-template="ghostRowTemplate"
      :is-footer-default="false"
      row-key="id"
      @add-column="handleAddColumn"
      @add-ghost-row="handleGhostRowAdd"
      @row-delete="handleDelete"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { ElInput, ElMessage, ElOption, ElSelect } from 'element-plus'

import type { Column } from 'element-plus'

interface MatrixRow {
  id: string
  origin: string
  [key: string]: string
}

interface GhostRowAddPayload {
  row: Partial<MatrixRow>
}

interface RowDeletePayload {
  rowIndex: number
}

type EditorMode = 'input' | 'select'

const destinations = [
  { key: 'miami', title: 'Miami, FL' },
  { key: 'atlanta', title: 'Atlanta, GA' },
  { key: 'newJersey', title: 'New Jersey, NJ' },
]

const origins = [
  'Los Angeles, CA',
  'San Francisco, CA',
  'Seattle, WA',
  'Portland, OR',
  'San Diego, CA',
  'San Jose, CA',
  'Sacramento, CA',
  'Oakland, CA',
  'Tacoma, WA',
  'Spokane, WA',
]

const editorMode = ref<EditorMode>('input')
const destinationOptions = ref([
  ...destinations.map(({ title }) => title),
  'Boston, MA',
  'Dallas, TX',
])

const rates = [
  ['1.95', '1.04', '3.45'],
  ['4.93', '1.04', '2.89'],
  ['1.94', '1.04', '4.12'],
  ['2.95', '1.04', '1.76'],
  ['4.17', '1.04', '3.23'],
  ['3.42', '1.04', '2.54'],
  ['4.93', '1.04', '4.67'],
  ['2.68', '1.04', '1.98'],
  ['2.82', '1.04', '3.11'],
  ['2.77', '1.04', '3.88'],
]

const tableData = ref<MatrixRow[]>(
  origins.map((origin, rowIndex) => ({
    id: `route-${rowIndex + 1}`,
    origin,
    ...destinations.reduce<Record<string, string>>(
      (row, destination, index) => {
        row[destination.key] = rates[rowIndex][index]
        return row
      },
      {}
    ),
  }))
)

const ghostRowTemplate = ref<Partial<MatrixRow>>({
  origin: '',
  ...destinations.reduce<Record<string, string>>((row, destination) => {
    row[destination.key] = ''
    return row
  }, {}),
})

const renderInput = (row: MatrixRow, column: Column<MatrixRow>) => (
  <ElInput
    v-model={row[String(column.dataKey)]}
    placeholder={column.title}
    float-label={false}
  />
)

const renderOriginEditor = (row: MatrixRow, column: Column<MatrixRow>) => {
  if (editorMode.value === 'input') return renderInput(row, column)

  return (
    <ElSelect
      v-model={row[String(column.dataKey)]}
      placeholder={column.title}
      float-label={false}
    >
      {origins.map((origin) => (
        <ElOption key={origin} label={origin} value={origin} />
      ))}
    </ElSelect>
  )
}

const renderDestinationHeader = (column: Column<MatrixRow>) => {
  if (editorMode.value === 'input') {
    return (
      <ElInput
        v-model={column.title}
        placeholder="Destination"
        float-label={false}
      />
    )
  }

  return (
    <ElSelect
      v-model={column.title}
      placeholder="Destination"
      float-label={false}
    >
      {destinationOptions.value.map((destination) => (
        <ElOption key={destination} label={destination} value={destination} />
      ))}
    </ElSelect>
  )
}

const createRateColumn = (key: string, title: string): Column<MatrixRow> => ({
  key,
  dataKey: key,
  title,
  width: 220,
  required: true,
  headerCellRenderer: ({ column }) => renderDestinationHeader(column),
  cellRenderer: ({ cellData }) => <span>{cellData}</span>,
  editCellRenderer: ({ rowData, column }) => renderInput(rowData, column),
})

const columns = ref<Column<MatrixRow>[]>([
  {
    key: 'origin',
    dataKey: 'origin',
    title: 'Route',
    width: 220,
    required: true,
    allowInsertBeforeFirstColumn: false,
    diagonalHeader: {
      from: 'From',
      to: 'To',
    },
    cellRenderer: ({ cellData }) => <span>{cellData}</span>,
    editCellRenderer: ({ rowData, column }) =>
      renderOriginEditor(rowData, column),
  },
  ...destinations.map(({ key, title }) => createRateColumn(key, title)),
])

let columnCount = destinations.length
let rowCount = tableData.value.length

const insertRateColumn = (insertIndex: number) => {
  columnCount += 1
  const key = `destination_${columnCount}`
  const column = createRateColumn(key, `Destination ${columnCount}`)
  const safeIndex = Math.max(1, Math.min(insertIndex, columns.value.length))

  columns.value.splice(safeIndex, 0, column)
  destinationOptions.value.push(String(column.title))
  tableData.value = tableData.value.map((row) => ({ ...row, [key]: '' }))
  ghostRowTemplate.value = { ...ghostRowTemplate.value, [key]: '' }
}

const appendRateColumn = () => insertRateColumn(columns.value.length)

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  insertRateColumn(insertIndex)
}

const handleDelete = ({ rowIndex }: RowDeletePayload) => {
  tableData.value.splice(rowIndex, 1)
}

const handleGhostRowAdd = ({ row }: GhostRowAddPayload) => {
  rowCount += 1
  tableData.value.push({
    ...ghostRowTemplate.value,
    ...row,
    id: `route-${rowCount}`,
  } as MatrixRow)
}

const handleImport = () => {
  ElMessage.info('Connect this action to your import flow')
}

const handleExport = () => {
  ElMessage.success(`Ready to export ${tableData.value.length} routes`)
}
</script>

<style scoped>
.rate-matrix-demo {
  display: grid;
  gap: 16px;
  max-width: 900px;
}

.rate-matrix-demo__toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.rate-matrix-demo :deep(.el-table-v2__row-cell) {
  padding: 6px 8px;
}

.rate-matrix-demo :deep(.el-input),
.rate-matrix-demo :deep(.el-select) {
  width: 100%;
}
</style>
