<template>
  <div class="resizable-columns-demo">
    <p class="event-text">{{ eventText }}</p>
    <el-table-v2
      :columns="columns"
      :data="data"
      :width="700"
      :height="320"
      fixed
      @header-dragend="handleHeaderDragend"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import type { Column } from 'element-plus'

const columns: Column<any>[] = [
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

const eventText = ref('Drag a header border to resize a column.')

const handleHeaderDragend = (
  newWidth: number,
  oldWidth: number,
  column: Column<any>
) => {
  eventText.value = `${String(column.title)}: ${oldWidth}px -> ${newWidth}px`
}
</script>

<style scoped>
.resizable-columns-demo {
  display: grid;
  gap: 12px;
}

.event-text {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>
