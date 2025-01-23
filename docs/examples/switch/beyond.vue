<template>
  <el-switch v-model="value1" size="large" class="mr-2" />
  <el-switch v-model="value1" disabled size="large" />
  <el-divider />
  <el-switch
    v-model="value2"
    size="large"
    active-text="Open"
    inactive-text="Close"
    class="mr-2"
  />
  <el-switch
    v-model="value2"
    disabled
    size="large"
    active-text="Open"
    inactive-text="Close"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value1 = ref(true)
const value2 = ref(true)
</script>
