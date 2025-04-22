<template>
  <div class="demo-progress">
    <el-progress :percentage="percentage" :color="customColor" />

    <el-divider />

    <el-progress
      :percentage="30"
      :stroke-width="15"
      striped
      color="#5b7282"
      striped-flow
    />
    <el-divider />

    <el-progress
      stroke-linecap="butt"
      type="circle"
      :stroke-width="3"
      :percentage="25"
      :color="customColor"
      :width="24"
      :show-text="false"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const percentage = ref(20)
const customColor = ref('#000')
</script>

<style scoped>
.demo-progress .el-progress--line {
  margin-bottom: 15px;
  max-width: 600px;
}
</style>
