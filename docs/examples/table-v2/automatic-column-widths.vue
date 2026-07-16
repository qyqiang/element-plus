<template>
  <div class="automatic-column-widths-demo">
    <p>
      Fixed columns keep their configured widths. Widthless columns size from
      their header text, and the last widthless column fills the remaining
      space.
    </p>
    <el-table-v2
      :columns="columns"
      :data="data"
      :width="700"
      :height="220"
      fixed
    />
  </div>
</template>

<script lang="tsx" setup>
import type { Column } from 'element-plus'

const columns: Column<any>[] = [
  {
    key: 'id',
    dataKey: 'id',
    title: 'ID',
  },
  {
    key: 'trailerAlias',
    dataKey: 'trailerAlias',
    title: 'Trailer Alias',
    width: 180,
  },
  {
    key: 'status',
    dataKey: 'status',
    title: 'Status',
  },
  {
    key: 'location',
    dataKey: 'location',
    title: 'Location',
    width: '160px',
  },
  {
    key: 'notes',
    dataKey: 'notes',
    title: 'Notes',
  },
]

const data = [
  {
    id: '1',
    trailerAlias: 'TRL-20490',
    status: 'Available',
    location: 'Los Angeles',
    notes: 'Ready for dispatch',
  },
  {
    id: '2',
    trailerAlias: 'TRL-20518',
    status: 'In transit',
    location: 'Tacoma',
    notes: 'ETA tomorrow',
  },
]
</script>

<style scoped>
.automatic-column-widths-demo p {
  margin: 0 0 16px;
  color: var(--el-text-color-secondary);
}
</style>
