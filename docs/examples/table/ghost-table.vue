<template>
  <div class="ghost-table-demo">
    <p class="ghost-table-demo__hint">
      Hover a header or row divider to insert a column or row. Ghost row cells
      at the bottom stay editable through the same `edit-cell` render path.
    </p>
    <el-button @click="handleEdit">Edit mode</el-button>
    <el-button @click="handleDisplay">Display mode</el-button>
    <el-table
      :data="tableData"
      border
      ghost-table
      :edit-table="editTable"
      have-table-text
      :total="tableData.length"
      update-time="2026-07-08 12:30 ET"
      row-key="id"
      show-add-column-trigger
      show-add-row-trigger
      max-height="460px"
      style="width: 100%"
      @add-column="handleAddColumn"
      @add-row="handleAddRow"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
      >
        <template #edit-cell="{ row }">
          <template v-if="column.editor === 'select'">
            <el-select
              v-model="row[column.prop]"
              :placeholder="`New ${column.label}`"
              :float-label="false"
            >
              <el-option
                v-for="option in column.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </template>
          <template v-else>
            <el-input
              v-model="row[column.prop]"
              :placeholder="`New ${column.label}`"
              :float-label="false"
            />
          </template>
        </template>
      </el-table-column>
      <el-table-column width="36px" fixed="right" class-name="icon-column">
        <template #default="{ $index }">
          <el-button
            class="icon-button"
            type="text"
            @click="handleDelete($index)"
          >
            <el-icon size="12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  d="M11.334 2.66667V1.33333C11.334 0.979711 11.1935 0.640573 10.9435 0.390524C10.6934 0.140476 10.3543 0 10.0007 0L6.00065 0C5.64703 0 5.30789 0.140476 5.05784 0.390524C4.80779 0.640573 4.66732 0.979711 4.66732 1.33333V2.66667H1.33398V4H2.66732V14C2.66732 14.5304 2.87803 15.0391 3.2531 15.4142C3.62818 15.7893 4.13688 16 4.66732 16H11.334C11.8644 16 12.3731 15.7893 12.7482 15.4142C13.1233 15.0391 13.334 14.5304 13.334 14V4H14.6673V2.66667H11.334ZM7.33398 11.3333H6.00065V7.33333H7.33398V11.3333ZM10.0007 11.3333H8.66732V7.33333H10.0007V11.3333ZM10.0007 2.66667H6.00065V1.33333H10.0007V2.66667Z"
                />
              </svg>
            </el-icon>
          </el-button>
        </template>
        <template #add-option="{ $index }">
          <el-button class="icon-button" type="text" @click="handleAdd()">
            <el-icon size="12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  d="M3.82026 11.0062C3.64674 11.0063 3.4749 10.9711 3.3146 10.9026C3.1543 10.8341 3.00868 10.7337 2.88608 10.6072L0 7.6341L1.10129 6.49954L3.82026 9.30198L10.8987 2.00623L12 3.14079L4.75443 10.6072C4.63183 10.7337 4.48621 10.8341 4.32591 10.9026C4.16561 10.9711 3.99378 11.0063 3.82026 11.0062Z"
                />
              </svg>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type EditorType = 'input' | 'select'
const editTable = ref(true)
const handleEdit = () => {
  editTable.value = true
}
const handleDisplay = () => {
  editTable.value = false
}
interface OptionItem {
  label: string
  value: string
}

interface ColumnItem {
  prop: string
  label: string
  minWidth: number
  editor: EditorType
  options?: OptionItem[]
  isNumber?: boolean | { place?: number }
}

interface TableRow {
  id: number
  [key: string]: string | number
}
const handleDelete = (index: number) => {
  //
}
const handleAdd = () => {
  //
}
const unitOptions: OptionItem[] = [
  {
    label: 'lbs',
    value: 'lbs',
  },
  {
    label: 'kg',
    value: 'kg',
  },
  {
    label: 'ton',
    value: 'ton',
  },
]

const columns = ref<ColumnItem[]>([
  {
    prop: 'product',
    label: 'Product',
    minWidth: 200,
    editor: 'input',
  },
  {
    prop: 'description',
    label: 'Description',
    minWidth: 220,
    editor: 'input',
  },
  {
    prop: 'qty',
    label: 'Qty',
    minWidth: 140,
    editor: 'input',
    isNumber: { place: 2 },
  },
  {
    prop: 'unit',
    label: 'Unit',
    minWidth: 140,
    editor: 'select',
    options: unitOptions,
  },
  {
    prop: 'rate',
    label: 'Rate',
    minWidth: 140,
    editor: 'input',
    isNumber: { place: 2 },
  },
])

const tableData = ref<TableRow[]>([
  {
    id: 1,
    product: 'Sand',
    description: 'Base material',
    qty: '1000',
    unit: 'lbs',
    rate: '3.45',
  },
  {
    id: 2,
    product: 'Gravel',
    description: 'Road mix',
    qty: '850',
    unit: 'kg',
    rate: '2.89',
  },
  {
    id: 3,
    product: 'Cement',
    description: 'Bagged stock',
    qty: '640',
    unit: 'ton',
    rate: '4.12',
  },
])

const extraColumnCount = ref(0)
const extraRowCount = ref(tableData.value.length)

const createRowValue = (column: ColumnItem, seed: number) => {
  if (column.editor === 'select') {
    return column.options?.[0]?.value ?? ''
  }

  if (column.isNumber) {
    return `${seed}.00`
  }

  return `${column.label} ${seed}`
}

const createRowFromDraft = () => {
  extraRowCount.value += 1
  return columns.value.reduce(
    (row, column) => {
      row[column.prop] = createRowValue(column, extraRowCount.value)
      return row
    },
    {
      id: extraRowCount.value + 100,
    } as TableRow
  )
}

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  extraColumnCount.value += 1
  const prop = `extra_${extraColumnCount.value}`
  const nextColumn: ColumnItem = {
    prop,
    label: `Extra ${extraColumnCount.value}`,
    minWidth: 180,
    editor: 'input',
  }

  columns.value.splice(insertIndex, 0, nextColumn)
  tableData.value = tableData.value.map((row, index) => ({
    ...row,
    [prop]: `Value ${extraColumnCount.value}-${index + 1}`,
  }))
}

const handleAddRow = ({ insertIndex }: { insertIndex: number }) => {
  const nextRow = createRowFromDraft()
  tableData.value.splice(insertIndex, 0, nextRow)
}
</script>

<style scoped>
.ghost-table-demo {
  padding: 8px 0;
}

.ghost-table-demo__hint {
  margin: 0 0 12px;
  font-size: 13px;
  color: #748aa1;
}
</style>
