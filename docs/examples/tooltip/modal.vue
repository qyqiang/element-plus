<template>
  <el-tooltip
    :visible="visible"
    placement="bottom"
    content="The tooltip is displayed above a modal overlay."
    trigger="click"
    modal
  >
    <template #default>
      <el-button @click="visible = !visible">Open modal tooltip</el-button>
    </template>
  </el-tooltip>

  <el-tooltip
    :visible="stickyVisible"
    placement="bottom"
    content="Clicking the overlay will not close this tooltip."
    trigger="click"
    modal
    modal-class="tooltip-modal-mask"
    :close-on-click-modal="false"
  >
    <template #default>
      <el-button @click="stickyVisible = !stickyVisible">
        Overlay won't close
      </el-button>
    </template>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
const stickyVisible = ref(false)
</script>

<style scoped>
:deep(.tooltip-modal-mask) {
  background: rgb(10 23 31 / 65%);
}
</style>
