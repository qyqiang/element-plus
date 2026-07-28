<template>
  <div class="mode-actions">
    <el-button @click="editTable = true">Edit mode</el-button>
    <el-button @click="editTable = false">Display mode</el-button>
  </div>
  <el-table-v2
    :columns="columns"
    :data="[]"
    :width="700"
    :max-height="240"
    fixed
    ghost-table
    :edit-table="editTable"
    :ghost-row-template="ghostRowTemplate"
    :total="0"
    update-time="2026-07-16 10:08"
    is-footer-default
  >
    <template #empty>
      <span class="empty-text">No Data</span>
    </template>
  </el-table-v2>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { ElButton, ElInput, ElOption, ElSelect } from 'element-plus'

import type { Column } from 'element-plus'

interface EmptyRow {
  id: string
  product: string
  qty: string
  unit: string
}

const ghostRowTemplate: EmptyRow = {
  id: 'ghost-row',
  product: '',
  qty: '',
  unit: '',
}

const editTable = ref(true)
const unitOptions = ['lbs', 'kg', 'ton']

const columns: Column<EmptyRow>[] = [
  {
    key: 'product',
    dataKey: 'product',
    title: 'Product',
    width: 280,
    editCellRenderer: ({ rowData }) => (
      <ElSelect
        v-model={rowData.product}
        placeholder="Product"
        float-label={false}
      >
        <ElOption label="Sand" value="sand" />
        <ElOption label="Gravel" value="gravel" />
      </ElSelect>
    ),
  },
  {
    key: 'qty',
    dataKey: 'qty',
    title: 'Qty',
    width: 220,
    editCellRenderer: ({ rowData }) => (
      <ElInput v-model={rowData.qty} placeholder="Qty" float-label={false} />
    ),
  },
  {
    key: 'unit',
    dataKey: 'unit',
    title: 'Unit',
    width: 160,
    editCellRenderer: ({ rowData }) => (
      <ElSelect v-model={rowData.unit} placeholder="Unit" float-label={false}>
        {unitOptions.map((unit) => (
          <ElOption key={unit} label={unit} value={unit} />
        ))}
      </ElSelect>
    ),
  },
]
</script>

<style scoped>
.mode-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.empty-text {
  color: var(--color-gray-500);
}
</style>
