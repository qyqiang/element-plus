<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="220"
    fixed
    ghost-table
    edit-table
    :ghost-row-template="ghostRowTemplate"
    @add-ghost-row="handleAdd"
  >
    <template #row-action="{ rowData }">
      <el-button
        link
        class="custom-row-action"
        aria-label="More actions"
        @click="handleAction(rowData)"
      >
        <el-icon><MoreFilled /></el-icon>
      </el-button>
    </template>
  </el-table-v2>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'
import { ElInput, ElMessage } from 'element-plus'

import type { Column } from 'element-plus'

interface TableRow {
  id: string
  name: string
  status: string
}

const columns: Column<TableRow>[] = [
  {
    key: 'name',
    dataKey: 'name',
    title: 'Name',
    width: 320,
    cellRenderer: ({ cellData }) => <span>{cellData}</span>,
    editCellRenderer: ({ rowData }) => (
      <ElInput v-model={rowData.name} placeholder="Name" float-label={false} />
    ),
  },
  {
    key: 'status',
    dataKey: 'status',
    title: 'Status',
    width: 344,
    cellRenderer: ({ cellData }) => <span>{cellData}</span>,
    editCellRenderer: ({ rowData }) => (
      <ElInput
        v-model={rowData.status}
        placeholder="Status"
        float-label={false}
      />
    ),
  },
]

const data = ref<TableRow[]>([
  {
    id: 'row-1',
    name: 'Sand',
    status: 'Ready',
  },
])
const ghostRowTemplate = {
  name: '',
  status: '',
}
let rowId = 1

const handleAdd = ({ row }: { row: Partial<TableRow> }) => {
  rowId += 1
  data.value.push({
    id: `row-${rowId}`,
    name: row.name || `Row ${rowId}`,
    status: row.status || 'Draft',
  })
}

const handleAction = (row: TableRow) => {
  ElMessage(`More actions for ${row.name}`)
}
</script>

<style scoped>
.custom-row-action {
  width: 100%;
  height: 100%;
}
</style>
