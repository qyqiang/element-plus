<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="760"
    :height="360"
    fixed
    can-edit-table
    editable
    show-add-column-trigger
    show-add-row-trigger
    @add-column="handleAddColumn"
    @add-row="handleAddRow"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { Column } from 'element-plus'

interface TableRow {
  id: string
  route: string
  state: string
  rate: string
  [key: string]: string
}

const columns = ref<Column<any>[]>([
  {
    key: 'route',
    dataKey: 'route',
    title: 'Route',
    width: 220,
  },
  {
    key: 'state',
    dataKey: 'state',
    title: 'State',
    width: 160,
  },
  {
    key: 'rate',
    dataKey: 'rate',
    title: 'Rate',
    width: 160,
  },
])

const data = ref<TableRow[]>([
  {
    id: 'row-0',
    route: 'Los Angeles, CA',
    state: 'GA',
    rate: '3.45',
  },
  {
    id: 'row-1',
    route: 'San Francisco, CA',
    state: 'WA',
    rate: '2.89',
  },
  {
    id: 'row-2',
    route: 'Tacoma, WA',
    state: 'NJ',
    rate: '3.11',
  },
])

let extraColumnCount = 0
let extraRowCount = 0

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  extraColumnCount += 1
  const key = `extra_${extraColumnCount}`

  columns.value.splice(insertIndex, 0, {
    key,
    dataKey: key,
    title: `Extra ${extraColumnCount}`,
    width: 180,
  })

  data.value = data.value.map((row, index) => ({
    ...row,
    [key]: `Value ${extraColumnCount}-${index + 1}`,
  }))
}

const handleAddRow = ({ insertIndex }: { insertIndex: number }) => {
  extraRowCount += 1

  const nextRow = columns.value.reduce(
    (row, column) => {
      const key = String(column.dataKey)
      row[key] =
        key === 'route'
          ? `New Route ${extraRowCount}`
          : key === 'state'
          ? `S${extraRowCount}`
          : `${column.title} ${extraRowCount}`
      return row
    },
    {
      id: `row-extra-${extraRowCount}`,
    } as TableRow
  )

  data.value.splice(insertIndex, 0, nextRow)
}
</script>
