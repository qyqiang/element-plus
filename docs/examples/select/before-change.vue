<template>
  <el-select
    v-model="value"
    :before-change="beforeChange"
    placeholder="Select"
    style="width: 240px"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

const value = ref('Option1')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
]

const beforeChange = async (nextValue: string, oldValue: string) => {
  return ElMessageBox.confirm(
    `Change from ${oldValue} to ${nextValue}?`,
    'Confirm selection',
    {
      type: 'warning',
    }
  )
    .then(() => true)
    .catch(() => false)
}
</script>
