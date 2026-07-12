<template>
  <el-table-v2 :columns="columns" :data="data" :width="480" :height="220" />
</template>

<script lang="ts" setup>
import type { Column } from 'element-plus'

const columns: Column<any>[] = [
  {
    key: 'route',
    dataKey: 'route',
    title: 'Route',
    width: 160,
    diagonalHeader: {
      from: 'From',
      to: 'To',
    },
  },
  {
    key: 'state',
    dataKey: 'state',
    title: 'State',
    width: 140,
  },
  {
    key: 'rate',
    dataKey: 'rate',
    title: 'Rate',
    width: 140,
  },
]

const data = [
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
]
</script>
