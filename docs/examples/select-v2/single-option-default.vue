<template>
  <el-select-v2
    v-model="value"
    :options="options"
    :clearable="false"
    placeholder="Select"
    style="width: 240px"
    @change="handleChange"
  />

  <div class="event-state">
    <div>Current value: {{ value || 'empty' }}</div>
    <div>Change events: {{ changeCount }}</div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('')
const changeCount = ref(0)
const options = [
  {
    value: 'Option1',
    label: 'Only option',
  },
]

const handleChange = () => {
  changeCount.value++
}
</script>

<style scoped>
.event-state {
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 16px;
  color: var(--el-text-color-regular);
  vertical-align: top;
}
</style>
