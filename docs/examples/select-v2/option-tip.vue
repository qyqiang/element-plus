<template>
  <el-switch v-model="showOptionTooltip" active-text="Show option tooltip" />
  <el-select-v2
    v-model="value"
    :options="options"
    :show-option-tooltip="showOptionTooltip"
    placeholder="Please select"
    style="width: 240px"
  >
    <template #default="{ item }">
      <span class="option-label">{{ item.label }}</span>
      <span class="option-value">{{ item.value }}</span>
    </template>
  </el-select-v2>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const showOptionTooltip = ref(true)
const options = [
  {
    value: 'short',
    label: 'Short label',
    tip: 'Shown even when the label fits.',
  },
  {
    value: 'long-with-tip',
    label: 'A very long option label that does not fit in the dropdown',
    tip: 'Shown below the overflowing label.',
  },
  {
    value: 'long-only',
    label: 'Another long option label keeps the original overflow tooltip',
  },
  {
    value: 'disabled',
    label: 'Disabled option',
    tip: 'Tips remain available for disabled options.',
    disabled: true,
  },
]
</script>

<style scoped>
.el-switch {
  display: flex;
  margin-bottom: 16px;
}

.option-label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.option-value {
  flex: none;
  margin-left: 8px;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}
</style>
