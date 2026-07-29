<template>
  <el-switch v-model="showOptionTooltip" active-text="Show option tooltip" />
  <el-select
    v-model="value"
    :show-option-tooltip="showOptionTooltip"
    placeholder="Select"
    style="width: 240px"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :tip="item.tip"
      :disabled="item.disabled"
    />
  </el-select>
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
</style>
