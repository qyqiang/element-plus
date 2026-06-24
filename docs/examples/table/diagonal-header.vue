<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column
      prop="route"
      label="Route"
      width="160px"
      :diagonal-header="diagonalHeader"
    />
    <el-table-column prop="state" label="State" min-width="140" />
    <el-table-column prop="rate" label="Rate" min-width="140" />
  </el-table>
</template>

<script setup lang="ts">
const diagonalHeader = {
  from: 'From',
  to: 'To',
}

const tableData = [
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
]
</script>
