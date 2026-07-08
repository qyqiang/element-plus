<template>
  <el-table
    :data="tableData"
    :on-dragend="onDragEnd"
    :on-dragstart="onDragStart"
    :row-draggable="true"
    style="width: 100%"
  >
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" fixed="right"/>
  </el-table>
</template>

<script lang="ts" setup>
const onDragEnd = (e) => {
  console.log(e)
}
const onDragStart = (e, row) => {
  console.log(e)
  console.log(row)
}

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]
</script>
