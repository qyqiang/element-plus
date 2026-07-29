<template>
  <el-select-v2
    v-model="value"
    :options="options"
    add-show-tip="test"
    placeholder="Please select"
    style="width: 240px"
  />
  <el-select-v2
    v-model="value7"
    :options="options1"
    add-show-tip="test"
    placeholder="Test Only 1"
    style="width: 240px"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const value = ref()
const value7 = ref()
const options = Array.from({ length: 1000 }).map((_, idx) => ({
  value: `Option ${idx + 1}`,
  label: `${initials[idx % 10]}${idx}`,
}))
const options1 = ref([
  {
    value: `Option 1`,
    label: `Option 1`,
  },
  {
    value: `Option 2`,
    label: `Option 1Option 1Option 1Option 1Option 1Option 1Option 1Option 1Option 1Option 1`,
  },
])
</script>
