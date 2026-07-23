<template>
  <div class="ghost-table-demo">
    <p class="ghost-table-demo__hint">
      Hover a header or row divider to insert a column or row. The bottom ghost
      row uses `editCellRenderer`, keeps column titles as placeholders, and uses
      the same built-in right-side action column as Editable Table. This example
      also folds in the editable table pattern with checkbox, input, and select
      editors in the same grid.
    </p>
    <div style="margin-bottom: 12px">
      <el-button @click="handleEdit">Edit mode</el-button>
      <el-button @click="handleDisplay">Display mode</el-button>
      <el-button @click="handleSubmit">Submit</el-button>
    </div>
    <el-table-v2
      ref="table"
      :columns="columns"
      :data="tableData"
      :height="400"
      fixed
      ghost-table
      :ghost-row-template="ghostRowTemplate"
      :edit-table="editTable"
      show-add-column-trigger
      show-add-row-trigger
      :total="tableData.length"
      update-time="2026-07-11 14:30 ET"
      is-footer-default
      row-key="id"
      @add-column="handleAddColumn"
      @add-row="handleAddRow"
      @add-ghost-row="handleGhostRowAdd"
      @row-delete="handleDelete"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref, watch } from 'vue'
import {
  ElButton,
  ElCheckbox,
  ElInput,
  ElMessage,
  ElOption,
  ElSelect,
} from 'element-plus'

import type { Column, TableV2Instance } from 'element-plus'

type EditorType = 'checkbox' | 'input' | 'select'

interface OptionItem {
  label: string
  value: string
}

interface ColumnItem extends Column<any> {
  editor?: EditorType
  options?: OptionItem[]
  required?: boolean
  isNumber?: boolean
}

interface TableRow {
  id: string
  [key: string]: string | boolean | null
}

interface GhostRowAddPayload {
  row: Partial<TableRow>
}
interface RowDeletePayload {
  rowIndex: number
}

const editTable = ref(true)
const table = ref<TableV2Instance>()
const ghostRowTemplate: Partial<TableRow> = {
  checked: false,
  product: '',
  description: '',
  qty: null,
  unit: '',
  rate: '',
  unitValue: null,
  quantity: null,
  commodity: '',
  commodityValue: null,
}

const unitOptions: OptionItem[] = [
  { label: 'lbs', value: 'lbs' },
  { label: 'kg', value: 'kg' },
  { label: 'ton', value: 'ton' },
]

const renderDisplayCell = (column: ColumnItem, row: TableRow) => {
  const value = row[column.dataKey as string] ?? ''

  if (column.editor === 'checkbox') {
    return <ElCheckbox model-value={Boolean(value)} disabled />
  }

  if (column.editor === 'select') {
    return (
      <span>
        {column.options?.find((item) => item.value === value)?.label ?? value}
      </span>
    )
  }

  return <span>{value}</span>
}

const handleChange = (
  row: TableRow,
  column: ColumnItem,
  value: string | boolean | null
) => {
  console.log(row)
  // console.log(column)
  // console.log(value)
  row.unitValue = value
}
const renderEditCell = (column: ColumnItem, row: TableRow) => {
  if (column.editor === 'checkbox') {
    return (
      <ElCheckbox
        v-model={row[column.dataKey as string]}
        onChange={(value: string | number | boolean) =>
          handleChange(row, column, Boolean(value))
        }
      />
    )
  }

  if (column.editor === 'select') {
    return (
      <ElSelect
        v-model={row[column.dataKey as string]}
        placeholder={'ee'}
        float-label={false}
        onChange={(value: string) => handleChange(row, column, value)}
      >
        {column.options?.map((option) => (
          <ElOption
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </ElSelect>
    )
  }

  return (
    <ElInput
      v-model={row[column.dataKey as string]}
      placeholder={column.title}
      float-label={false}
      onChange={(value: string) => handleChange(row, column, value)}
    />
  )
}

const columns = ref<ColumnItem[]>([
  {
    key: 'checked',
    dataKey: 'checked',
    title: '',
    width: 64,
    align: 'center',
    editor: 'checkbox',
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[0], rowData),
    editCellRenderer: ({ rowData }) =>
      renderEditCell(columns.value[0], rowData),
  },
  {
    key: 'product',
    dataKey: 'product',
    title: 'Product',
    width: 180,
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[1], rowData),
  },
  {
    key: 'description',
    dataKey: 'description',
    title: 'Description',
    width: 220,
    required: true,
    editor: 'input',
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[2], rowData),
    editCellRenderer: ({ rowData }) =>
      renderEditCell(columns.value[2], rowData),
  },
  {
    key: 'qty',
    dataKey: 'qty',
    title: 'Qty',
    width: 140,
    editor: 'input',
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[3], rowData),
    editCellRenderer: ({ rowData }) =>
      renderEditCell(columns.value[3], rowData),
  },
  {
    key: 'unit',
    dataKey: 'unit',
    title: 'Unit',
    width: 140,
    editor: 'select',
    required: true,
    options: unitOptions,
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[4], rowData),
    editCellRenderer: ({ rowData }) =>
      renderEditCell(columns.value[4], rowData),
  },
  {
    key: 'rate',
    dataKey: 'rate',
    title: 'Rate',
    editor: 'input',
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[5], rowData),
    editCellRenderer: ({ rowData }) =>
      renderEditCell(columns.value[5], rowData),
  },
])

const tableData = ref<TableRow[]>([
  {
    id: '1',
    checked: false,
    product: 'Sand',
    description: 'Base material',
    qty: '',
    unit: 'lbs',
    rate: '3.45',
    action: '',
  },
])

let extraColumnCount = 0
let extraRowCount = tableData.value.length

const createRowValue = (column: ColumnItem, seed: number) => {
  if (column.editor === 'checkbox') return false
  if (column.editor === 'select') {
    return column.options?.[0]?.value ?? ''
  }
  return `${column.title || 'Value'} ${seed}`
}

const handleEdit = () => {
  editTable.value = true
}

const handleDisplay = () => {
  editTable.value = false
}

const handleSubmit = () => {
  const valid = table.value?.validateRequiredColumns()

  if (valid) {
    ElMessage({
      type: 'success',
      message: 'Successfully edited',
    })
  } else {
    ElMessage({
      type: 'error',
      message: 'Please complete all required fields',
    })
  }
}

const handleDelete = ({ rowIndex }: RowDeletePayload) => {
  tableData.value.splice(rowIndex, 1)
}

const createRowFromDraft = (draft?: Partial<TableRow>) => {
  extraRowCount += 1

  const nextRow = {
    ...ghostRowTemplate,
    ...(draft ?? {}),
    id: `row-${extraRowCount}`,
  } as TableRow

  return columns.value.reduce((row, column) => {
    const key = column.dataKey as string

    const draftValue = row[key]
    row[key] =
      draftValue === undefined || draftValue === ''
        ? createRowValue(column, extraRowCount)
        : draftValue
    return row
  }, nextRow)
}

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  extraColumnCount += 1
  const key = `extra_${extraColumnCount}`
  const nextColumn: ColumnItem = {
    key,
    dataKey: key,
    title: `Extra ${extraColumnCount}`,
    width: 180,
    editor: 'input',
    cellRenderer: ({ rowData }) => <span>{rowData[key]}</span>,
    editCellRenderer: ({ rowData, column }) => (
      <ElInput
        v-model={rowData[key]}
        placeholder={column.title}
        float-label={false}
      />
    ),
  }

  columns.value.splice(insertIndex, 0, nextColumn)
  tableData.value = tableData.value.map((row, index) => ({
    ...row,
    [key]: `Value ${extraColumnCount}-${index + 1}`,
  }))
}

const handleAddRow = ({ insertIndex }: { insertIndex: number }) => {
  const nextRow = createRowFromDraft()

  tableData.value.splice(insertIndex, 0, nextRow)
}

const handleGhostRowAdd = ({ row }: GhostRowAddPayload) => {
  tableData.value.push(createRowFromDraft(row))
}
watch(
  () => tableData.value,
  (val) => {
    console.log(val)
  },
  { immediate: true, deep: true }
)
</script>

<style scoped>
.ghost-table-demo {
  display: grid;
  gap: 12px;
}

.ghost-table-demo__hint {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.ghost-table-demo__event {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  word-break: break-word;
}
</style>
