<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="220"
    fixed
  />
</template>

<script lang="tsx" setup>
import type { Column } from 'element-plus'

interface TableRow {
  id: string
  statusValue: string
  statusLabel: string
  owner: string
}

const columns: Column<TableRow>[] = [
  {
    key: 'status',
    dataKey: 'statusValue',
    labelKey: 'statusLabel',
    title: 'Status',
    width: 240,
  },
  {
    key: 'owner',
    dataKey: 'owner',
    title: 'Owner',
    width: 240,
  },
]

const data: TableRow[] = [
  {
    id: 'row-1',
    statusValue: 'in_transit',
    statusLabel: 'In transit',
    owner: 'Alice',
  },
  {
    id: 'row-2',
    statusValue: 'delivered',
    statusLabel: 'Delivered',
    owner: 'Bob',
  },
  {
    id: 'row-3',
    statusValue: 'on_hold',
    statusLabel: 'On hold',
    owner: 'Carol',
  },
]
</script>
