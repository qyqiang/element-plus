<template>
  <td
    :colspan="colspan"
    :rowspan="rowspan"
    :data-cellIndex="rowIndex + '-' + cellIndex"
  >
    <div class="cell-height"><slot /></div>
  </td>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TableTdWrapper',
})

defineProps({
  colspan: {
    type: Number,
    default: 1,
  },
  rowspan: {
    type: Number,
    default: 1,
  },
  cellIndex: {
    type: Number,
    default: 0,
  },
  rowIndex: {
    type: Number,
    default: 0,
  },
})
</script>
