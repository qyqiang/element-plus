<template>
  <div class="percentage-widths-demo">
    <p class="hint">
      Percentage widths are resolved against the current table width, so these
      three columns stay at 50% / 30% / 20% as the table layout changes.
    </p>
    <el-table-v2
      :columns="columns"
      :data="data"
      :width="700"
      :height="280"
      fixed
    />
  </div>
</template>

<script lang="ts" setup>
import type { Column } from 'element-plus'

const columns: Column<any>[] = [
  {
    key: 'route',
    dataKey: 'route',
    title: 'Route',
    width: '50%',
  },
  {
    key: 'state',
    dataKey: 'state',
    title: 'State',
    width: '30%',
  },
  {
    key: 'rate',
    dataKey: 'rate',
    title: 'Rate',
    width: '20%',
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

<style scoped>
.percentage-widths-demo {
  display: grid;
  gap: 12px;
}

.hint {
  margin: 0;
  color: var(--el-text-color-secondary);
  font-size: 14px;
}
</style>
