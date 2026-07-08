<template>
  <el-button class="icon-button" text @click="handleAdd">
    <el-icon size="12">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
      >
        <path
          d="M3.82026 11.0062C3.64674 11.0063 3.4749 10.9711 3.3146 10.9026C3.1543 10.8341 3.00868 10.7337 2.88608 10.6072L0 7.6341L1.10129 6.49954L3.82026 9.30198L10.8987 2.00623L12 3.14079L4.75443 10.6072C4.63183 10.7337 4.48621 10.8341 4.32591 10.9026C4.16561 10.9711 3.99378 11.0063 3.82026 11.0062Z"
        />
      </svg>
    </el-icon>
  </el-button>
</template>

<script lang="ts" setup>
import { inject } from 'vue'
import ElButton from '@element-plus/components/button'
import ElIcon from '@element-plus/components/icon'
import { TABLE_INJECTION_KEY } from './tokens'
import { ghostRowKey } from './private'

import type { PropType } from 'vue'
import type { DefaultRow, Table } from './table/defaults'

const props = defineProps({
  row: {
    type: Object as PropType<DefaultRow>,
    required: true,
  },
})

const table = inject(TABLE_INJECTION_KEY) as Table<DefaultRow> | undefined

const handleAdd = (event: MouseEvent) => {
  table?.emit('add-ghost-row', {
    event,
    row: props.row,
    rowIndex: -1,
    rowKey: props.row?.[ghostRowKey],
  })
}
</script>
