<template>
  <div class="fixed-action-column-demo">
    <div class="mode-actions">
      <el-button @click="overflow = false">Columns fit</el-button>
      <el-button @click="overflow = true">Columns overflow</el-button>
      <span>{{ statusText }}</span>
    </div>
    <el-table-v2
      :columns="columns"
      :data="data"
      :width="700"
      :height="300"
      fixed
      can-edit-table
      editable
      :is-footer-default="false"
      @row-delete="handleDelete"
    />
  </div>
</template>

<script lang="tsx" setup>
import { computed, ref } from 'vue'
import { ElInput } from 'element-plus'

import type { Column } from 'element-plus'

interface TableRow {
  id: string
  route: string
  unit: string
  rate: string
}

const overflow = ref(false)
const data = ref<TableRow[]>([
  {
    id: 'row-1',
    route: 'Los Angeles, CA',
    unit: 'lbs',
    rate: '3.45',
  },
  {
    id: 'row-2',
    route: 'San Francisco, CA',
    unit: 'kg',
    rate: '2.89',
  },
  {
    id: 'row-3',
    route: 'Tacoma, WA',
    unit: 'ton',
    rate: '3.11',
  },
])

const columnWidth = computed(() => (overflow.value ? 360 : 210))
const statusText = computed(() =>
  overflow.value ? 'Horizontal scrolling enabled' : 'No horizontal scrolling'
)

const columns = computed<Column<TableRow>[]>(() => [
  {
    key: 'route',
    dataKey: 'route',
    title: 'Route',
    width: columnWidth.value,
    cellRenderer: ({ rowData }) => (
      <ElInput
        v-model={rowData.route}
        placeholder="Route"
        float-label={false}
      />
    ),
  },
  {
    key: 'unit',
    dataKey: 'unit',
    title: 'Unit',
    width: columnWidth.value,
    cellRenderer: ({ rowData }) => (
      <ElInput v-model={rowData.unit} placeholder="Unit" float-label={false} />
    ),
  },
  {
    key: 'rate',
    dataKey: 'rate',
    title: 'Rate',
    width: columnWidth.value,
    cellRenderer: ({ rowData }) => (
      <ElInput v-model={rowData.rate} placeholder="Rate" float-label={false} />
    ),
  },
])

const handleDelete = ({ rowIndex }: { rowIndex: number }) => {
  data.value.splice(rowIndex, 1)
}
</script>

<style scoped>
.fixed-action-column-demo {
  display: grid;
  gap: 16px;
}

.mode-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>
