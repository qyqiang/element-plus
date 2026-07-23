<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :sort-by="sortBy"
    :width="700"
    :height="300"
    fixed
    @column-sort="onSort"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { SortBy } from 'element-plus'

const columns = [
  {
    key: 'name',
    dataKey: 'name',
    title: 'Name',
    width: 220,
    sortable: true,
  },
  {
    key: 'quantity',
    dataKey: 'quantity',
    title: 'Quantity',
    width: 180,
  },
  {
    key: 'unit',
    dataKey: 'unit',
    title: 'Unit',
    width: 180,
  },
]

const data = [
  { id: 1, name: 'Sand', quantity: 640, unit: 'lbs' },
  { id: 2, name: 'Gravel', quantity: 850, unit: 'kg' },
  { id: 3, name: 'Cement', quantity: 420, unit: 'ton' },
]

const sortBy = ref<SortBy>()

const onSort = (value: SortBy) => {
  sortBy.value = value
}
</script>
