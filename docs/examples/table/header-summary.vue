<template>
  <el-table :data="tableData" border style="width: 100%">
    <el-table-column
      prop="amount"
      label="Invoice Amount"
      summary="Total: $613.50"
      sortable
      align="right"
      width="280"
    />
    <el-table-column prop="customer" label="Customer" />
    <el-table-column prop="status" label="Status" />
  </el-table>
</template>

<script lang="ts" setup>
const tableData = [
  {
    amount: '$181,450.00',
    customer: 'North Star Logistics',
    status: 'Approved',
  },
  {
    amount: '$231,036.50',
    customer: 'River Freight',
    status: 'Pending',
  },
  {
    amount: '$200,550.00',
    customer: 'Summit Transport',
    status: 'Approved',
  },
]
</script>
