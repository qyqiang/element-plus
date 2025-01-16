<template>
  <div>
    <el-checkbox />
    <el-checkbox v-model="checked2" disabled />
    <el-checkbox v-model="checked3" disabled />
    <el-checkbox :error="isError" />
    <el-checkbox :indeterminate="isIndeterminate" />
  </div>
  <el-divider />
  <div>
    <el-checkbox v-model="checked1" label="Option 1" />
    <el-checkbox v-model="checked2" label="Option 2" disabled />
    <el-checkbox v-model="checked3" label="Option 3" disabled />
    <el-checkbox label="Error" :error="isError" />
    <el-checkbox :indeterminate="isIndeterminate">Indeterminate </el-checkbox>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const isIndeterminate = ref(true)
const isError = ref(true)
const checked1 = ref(false)
const checked2 = ref(false)
const checked3 = ref(true)
</script>
