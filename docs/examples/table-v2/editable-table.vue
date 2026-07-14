<template>
  <el-table-v2
    :columns="columns"
    :data="data"
    fixed
    :height="400"
    :editable="editable"
    :total="100"
    is-footer-default
    update-time="2026-07-07"
    :can-edit-table="true"
    @row-add="handleAdd"
    @row-delete="handleDelete"
  />
  <el-button @click="handleEdit">Edit Mode</el-button>
  <el-button @click="handlePlay">Display Mode</el-button>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
import { ElButton, ElOption, ElSelect } from 'element-plus'

import type { Column } from 'element-plus'

const editable = ref(true)
let id = 0
const handleEdit = () => {
  editable.value = true
}
const handlePlay = () => {
  editable.value = false
}
const dataGenerator = () => ({
  id: `random-id-${++id}`,
  name: '1',
  date: '2020-10-1',
})

const columns: Column<any>[] = [
  {
    key: 'date1',
    title: 'Date1',
    dataKey: 'date',
    width: 150,
    cellRenderer: ({ cellData: date }) => <El-checkbox></El-checkbox>,
  },
  {
    key: 'date2',
    title: 'Date2',
    dataKey: 'date',
    width: 150,
    cellRenderer: ({ cellData: date }) => <span>{date}</span>,
  },
  {
    key: 'date',
    title: 'Date',
    dataKey: 'date',
    width: 150,
    required: true,
    cellRenderer: (cloumn) => {
      return <El-input placeholder="test1" float-label={false} v-model={cloumn.cellData}></El-input>
    },
  },
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 150,
    align: 'center',
    required: true,
    cellRenderer: (cloumn) => {
      return (
        <El-select float-label={false} placeholder="test1" v-model={cloumn.cellData}>
          <El-option value="1">ddd</El-option>
          <El-option value="2">ddd2</El-option>
        </El-select>
      )
    },
  },
]
const handleDelete = (val) => {
  console.log(val)
}
const handleAdd = (val) => {
  console.log(val)
}
const data = ref(Array.from({ length: 520 }).map(dataGenerator))
</script>
