<template>
  <el-select-v2
    v-model="value"
    :options="options"
    placeholder="Please select"
    style="width: 240px"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
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
