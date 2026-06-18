<template>
  <div class="flex flex-wrap gap-4 items-center">
    <el-select
      v-model="value1"
      placeholder="Select"
      style="width: 240px"
      clearable
    >
      <template #label="{ label, value }">
        <span>{{ label }}: </span>
        <span style="font-weight: bold">{{ value }}</span>
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-model="value2"
      placeholder="Select"
      style="width: 240px"
      clearable
      value-key="value"
    >
      <template #label="{ item }">
        <span>{{ item.label }}: </span>
        <span style="font-weight: bold">{{ item.icon }}</span>
      </template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :raw-option="item"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref<string>('Option1')
const value2 = ref<string>('Option1')
const options = [
  {
    value: 'Option1',
    label: 'Label1',
    icon: 'Icon1',
  },
  {
    value: 'Option2',
    label: 'Label2',
    icon: 'Icon2',
  },
  {
    value: 'Option3',
    label: 'Label3',
    icon: 'Icon3',
  },
  {
    value: 'Option4',
    label: 'Label4',
    icon: 'Icon4',
  },
  {
    value: 'Option5',
    label: 'Label5',
    icon: 'Icon5',
  },
]
</script>

<style scoped></style>
