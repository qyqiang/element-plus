<template>
  <el-select
    v-model="value"
    :clearable="false"
    placeholder="Select"
    style="width: 240px"
    @change="handleChange"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>

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
