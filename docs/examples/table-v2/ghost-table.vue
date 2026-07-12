<template>
  <div class="ghost-table-demo">
    <p class="ghost-table-demo__hint">
      Hover a header or row divider to insert a column or row. The bottom ghost
      row uses `editCellRenderer`, keeps column titles as placeholders, and
      swaps the trailing action cell for the built-in add action. This example
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
      :width="900"
      :height="460"
      fixed
      ghost-table
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
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import {
  ElButton,
  ElCheckbox,
  ElIcon,
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
  [key: string]: string | boolean
}

interface GhostRowAddPayload {
  row: Partial<TableRow>
}

const editTable = ref(true)
const table = ref<TableV2Instance>()

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

const renderEditCell = (column: ColumnItem, row: TableRow) => {
  if (column.editor === 'checkbox') {
    return <ElCheckbox v-model={row[column.dataKey as string]} />
  }

  if (column.editor === 'select') {
    return (
      <ElSelect
        v-model={row[column.dataKey as string]}
        placeholder={column.title}
        float-label={false}
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
    editCellRenderer: ({ rowData }) => renderEditCell(columns.value[0], rowData),
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
    editCellRenderer: ({ rowData }) => renderEditCell(columns.value[2], rowData),
  },
  {
    key: 'qty',
    dataKey: 'qty',
    title: 'Qty',
    width: 140,
    required: true,
    editor: 'input',
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[3], rowData),
    editCellRenderer: ({ rowData }) => renderEditCell(columns.value[3], rowData),
  },
  {
    key: 'unit',
    dataKey: 'unit',
    title: 'Unit',
    width: 140,
    required: true,
    editor: 'select',
    options: unitOptions,
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[4], rowData),
    editCellRenderer: ({ rowData }) => renderEditCell(columns.value[4], rowData),
  },
  {
    key: 'rate',
    dataKey: 'rate',
    title: 'Rate',
    width: 140,
    editor: 'input',
    cellRenderer: ({ rowData }) => renderDisplayCell(columns.value[5], rowData),
    editCellRenderer: ({ rowData }) => renderEditCell(columns.value[5], rowData),
  },
  {
    key: 'action',
    dataKey: 'action',
    title: '',
    width: 36,
    fixed: 'right',
    align: 'center',
    cellRenderer: ({ rowIndex }) => (
      <ElButton class="icon-button" text onClick={() => handleDelete(rowIndex)}>
        <ElIcon size={12}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
          >
            <path d="M11.334 2.66667V1.33333C11.334 0.979711 11.1935 0.640573 10.9435 0.390524C10.6934 0.140476 10.3543 0 10.0007 0L6.00065 0C5.64703 0 5.30789 0.140476 5.05784 0.390524C4.80779 0.640573 4.66732 0.979711 4.66732 1.33333V2.66667H1.33398V4H2.66732V14C2.66732 14.5304 2.87803 15.0391 3.2531 15.4142C3.62818 15.7893 4.13688 16 4.66732 16H11.334C11.8644 16 12.3731 15.7893 12.7482 15.4142C13.1233 15.0391 13.334 14.5304 13.334 14V4H14.6673V2.66667H11.334ZM7.33398 11.3333H6.00065V7.33333H7.33398V11.3333ZM10.0007 11.3333H8.66732V7.33333H10.0007V11.3333ZM10.0007 2.66667H6.00065V1.33333H10.0007V2.66667Z" />
          </svg>
        </ElIcon>
      </ElButton>
    ),
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
  {
    id: '2',
    checked: true,
    product: 'Gravel',
    description: 'Road mix',
    qty: '850',
    unit: 'kg',
    rate: '2.89',
    action: '',
  },
  {
    id: '3',
    checked: false,
    product: 'Cement',
    description: 'Bagged stock',
    qty: '640',
    unit: 'ton',
    rate: '4.12',
    action: '',
  },
])

let extraColumnCount = 0
let extraRowCount = tableData.value.length

const getActionColumnIndex = () =>
  columns.value.findIndex((column) => column.key === 'action')

const createRowValue = (column: ColumnItem, seed: number) => {
  if (column.key === 'action') return ''
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

const handleDelete = (rowIndex: number) => {
  tableData.value.splice(rowIndex, 1)
}

const createRowFromDraft = (draft?: Partial<TableRow>) => {
  extraRowCount += 1

  return columns.value.reduce(
    (row, column) => {
      const key = column.dataKey as string

      if (column.key === 'action') {
        row[key] = ''
        return row
      }

      const draftValue = draft?.[key]
      row[key] =
        draftValue === undefined || draftValue === ''
          ? createRowValue(column, extraRowCount)
          : draftValue
      return row
    },
    {
      id: `row-${extraRowCount}`,
    } as TableRow
  )
}

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  extraColumnCount += 1
  const key = `extra_${extraColumnCount}`
  const actionColumnIndex = getActionColumnIndex()
  const targetInsertIndex =
    actionColumnIndex === -1
      ? insertIndex
      : Math.min(insertIndex, actionColumnIndex)
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

  columns.value.splice(targetInsertIndex, 0, nextColumn)
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

  columns.value.forEach((column) => {
    const key = column.dataKey as string
    row[key] = ''
  })
}
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
</style>
