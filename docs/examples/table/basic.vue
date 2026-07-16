<template>
  <h2>Table Width</h2>
  <el-table
    :data="tableData"
    border
    class="mt-4"
    max-height="440px"
    tooltip-effect="light"
  >
    <el-table-column :resizable="false" class-name="tip-column" width="32px" />
    <el-table-column
      v-for="item in column"
      :key="item.prop"
      :label="item.label"
      :width="item.width"
      :prop="item.prop"
    />
  </el-table>
  <h2>Do not table width</h2>
  <p class="table-width-description">
    Widthless columns use the header text width plus 48px, with a minimum width
    of 80px.
  </p>
  <el-table
    :data="tableData"
    border
    class="mt-4"
    max-height="440px"
    tooltip-effect="light"
  >
    <el-table-column :resizable="false" class-name="tip-column" width="32px" />
    <el-table-column
      v-for="item in columnNoWidth"
      :key="item.prop"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
    />
  </el-table>
  <h3>Fill the remaining width</h3>
  <p class="table-width-description">
    When the calculated widths do not fill the table, the last widthless column
    receives all remaining space.
  </p>
  <el-table :data="tableData" border class="mt-4" style="width: 100%">
    <el-table-column prop="date" label="Date" />
    <el-table-column prop="name" label="Name" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <h2>Basic Table</h2>
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
    <el-table-column prop="address" label="Address" fixed="right" />
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
const column = [
  {
    label: 'Gating Result',
    prop: 'taskName',
    sortable: 'custom',
    width: 140,
  },
  {
    label: 'Trailer Alias',
    prop: 'component',
    width: 140,
  },
  {
    label: 'Preload',
    prop: 'scope',
    width: 140,
  },
  {
    label: 'Linked Load',
    prop: 'customer',
    width: 140,
  },
  {
    label: 'Current Contained',
    prop: 'lane',
    width: 140,
  },
  {
    label: 'OS',
    prop: 'lane',
    width: 140,
  },
  {
    label: 'LC',
    prop: 'lane',
    width: 140,
  },
  {
    label: 'Location',
    prop: 'lane',
    width: 140,
  },
  {
    label: 'Trailer Type',
    prop: 'lane',
    width: 140,
  },
  {
    label: 'Trailer Qualification',
    prop: 'lane',
    width: 160,
  },
]
const columnNoWidth = [
  {
    label: 'Gating Result',
    prop: 'taskName',
    sortable: 'custom',
    width: 240,
  },
  {
    label: 'Trailer Alias',
    prop: 'component',
  },
  {
    label: 'Preload',
    prop: 'scope',
  },
  {
    label: 'Linked Load',
    prop: 'customer',
  },
  {
    label: 'Current Contained',
    prop: 'lane',
  },
  {
    label: 'OS',
    prop: 'lane',
  },
  {
    label: 'LC',
    prop: 'lane',
  },
  {
    label: 'Location',
    prop: 'lane',
  },
  {
    label: 'Trailer Type',
    prop: 'lane',
  },
  {
    label: 'Trailer Qualification',
    prop: 'lane',
  },
]
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

<style scoped>
.table-width-description {
  margin: 8px 0 0;
  color: var(--el-text-color-secondary);
}
</style>
