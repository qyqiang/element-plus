<template>
  <el-table
    :data="tableData"
    border
    show-add-column-trigger
    show-add-row-trigger
    style="width: 100%"
    @add-column="handleAddColumn"
    @add-row="handleAddRow"
    max-height="440px"
  >
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :min-width="column.minWidth"
    >
      <template #default>
        <el-input placeholder="ddd"></el-input>
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="handleAdd">Add Date</el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ColumnItem {
  prop: string
  label: string
  minWidth?: number
}

interface TableRow {
  date: string
  name: string
  address: string

  [key: string]: string
}

const columns = ref<ColumnItem[]>([
  {
    prop: 'date',
    label: 'Date',
    minWidth: 140
  },
  {
    prop: 'name',
    label: 'Name',
    minWidth: 160
  },
  {
    prop: 'address',
    label: 'Address',
    minWidth: 240
  }
])

const tableData = ref<TableRow[]>([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles'
  },
  {
    date: '2016-05-02',
    name: 'Alice',
    address: 'No. 189, Grove St, Seattle'
  },
  {
    date: '2016-05-04',
    name: 'Jack',
    address: 'No. 189, Grove St, San Francisco'
  }
])

const extraColumnCount = ref(0)
const extraRowCount = ref(0)

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  extraColumnCount.value += 1
  const prop = `extra_${extraColumnCount.value}`
  columns.value.splice(insertIndex, 0, {
    prop,
    label: `Extra ${extraColumnCount.value}`,
    minWidth: 160
  })
  tableData.value = tableData.value.map((row, index) => ({
    ...row,
    [prop]: `Value ${extraColumnCount.value}-${index + 1}`
  }))
}

const handleAddRow = ({ insertIndex }: { insertIndex: number }) => {
  extraRowCount.value += 1
  const nextRow: TableRow = columns.value.reduce((acc, column) => {
    acc[column.prop] =
      column.prop === 'date'
        ? `2016-05-${String(extraRowCount.value + 10).padStart(2, '0')}`
        : `${column.label} ${extraRowCount.value}`
    return acc
  }, {} as TableRow)

  tableData.value.splice(insertIndex, 0, nextRow)
}
const dataGenerator = () => ({
  id: `random-id-${Date.now()}`,
  name: '1',
  date: '2016-05-04',
  address: 'No. 189, Grove St, San Francisco'
})
const handleAdd = () => {
  tableData.value = Array.from({ length: 520 }).map(dataGenerator)
}
</script>
