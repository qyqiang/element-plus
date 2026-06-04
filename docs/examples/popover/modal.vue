<template>
  <el-popover :visible="visible" placement="bottom" :width="220" modal>
    <p>The popover is displayed above a modal overlay.</p>
    <div class="actions">
      <el-button size="small" text @click="visible = false">Cancel</el-button>
      <el-button size="small" type="primary" @click="visible = false">
        Confirm
      </el-button>
    </div>
    <template #reference>
      <el-button @click="visible = true">Open modal popover</el-button>
    </template>
  </el-popover>

  <el-popover
    :visible="stickyVisible"
    placement="bottom"
    :width="260"
    modal
    modal-class="popover-modal-mask"
    :close-on-click-modal="false"
  >
    <p>Clicking the overlay will not close this popover.</p>
    <div class="actions">
      <el-button size="small" @click="stickyVisible = false">Close</el-button>
    </div>
    <template #reference>
      <el-button @click="stickyVisible = true">Overlay won't close</el-button>
    </template>
  </el-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
const stickyVisible = ref(false)
</script>

<style scoped>
.actions {
  margin-top: 12px;
  text-align: right;
}

:deep(.popover-modal-mask) {
  background: rgb(10 23 31 / 65%);
}
</style>
