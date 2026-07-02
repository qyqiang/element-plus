<template>
  <div class="table-first-column-control-demo">
    <div class="table-first-column-control-demo__toolbar">
      <span class="table-first-column-control-demo__label">
        Allow inserting before the first column
      </span>
      <el-switch v-model="allowInsertBeforeFirstColumn" />
    </div>

    <el-table
      :data="tableData"
      border
      show-add-column-trigger
      style="width: 100%"
      @add-column="handleAddColumn"
    >
      <el-table-column
        v-for="(column, index) in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
        :allow-insert-before-first-column="
          index === 0 ? allowInsertBeforeFirstColumn : undefined
        "
      />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ColumnItem {
  prop: string
  label: string
  minWidth?: number
}

interface TableRow {
  route: string
  state: string
  rate: string
  [key: string]: string
}

const allowInsertBeforeFirstColumn = ref(true)

const columns = ref<ColumnItem[]>([
  {
    prop: 'route',
    label: 'Route',
    minWidth: 220,
  },
  {
    prop: 'state',
    label: 'State',
    minWidth: 140,
  },
  {
    prop: 'rate',
    label: 'Rate',
    minWidth: 140,
  },
])

const tableData = ref<TableRow[]>([
  {
    route: 'Los Angeles, CA',
    state: 'GA',
    rate: '3.45',
  },
  {
    route: 'San Francisco, CA',
    state: 'WA',
    rate: '2.89',
  },
  {
    route: 'Tacoma, WA',
    state: 'NJ',
    rate: '3.11',
  },
])

const extraColumnCount = ref(0)

const handleAddColumn = ({ insertIndex }: { insertIndex: number }) => {
  extraColumnCount.value += 1
  const prop = `extra_${extraColumnCount.value}`
  const nextColumn = {
    prop,
    label: `Extra ${extraColumnCount.value}`,
    minWidth: 160,
  }

  columns.value.splice(insertIndex, 0, nextColumn)
  tableData.value = tableData.value.map((row, index) => ({
    ...row,
    [prop]: `Value ${extraColumnCount.value}-${index + 1}`,
  }))
}
</script>

<style scoped>
.table-first-column-control-demo__toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.table-first-column-control-demo__label {
  color: var(--el-text-color-regular);
  font-size: 14px;
}
</style>
