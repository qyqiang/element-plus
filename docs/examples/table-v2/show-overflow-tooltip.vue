<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="220"
    fixed
  />
</template>

<script lang="ts" setup>
const columns = [
  {
    key: 'id',
    dataKey: 'id',
    title: 'ID',
    width: 100,
  },
  {
    key: 'name',
    dataKey: 'name',
    title: 'Name',
    width: 180,
  },
  {
    key: 'notes',
    dataKey: 'notes',
    title: 'Delivery notes',
    width: 420,
    showOverflowTooltip: true,
  },
]

const data = [
  {
    id: '001',
    name: 'Standard load',
    notes: 'Short content does not display a tooltip.',
  },
  {
    id: '002',
    name: 'Oversized shipment',
    notes:
      'This delivery note is intentionally long so that it overflows the cell and appears in a tooltip when you hover over it.',
  },
  {
    id: '003',
    name: 'Priority load',
    notes:
      'Keep the trailer at the designated dock until the receiving team completes the inspection.',
  },
]
</script>
