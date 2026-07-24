<template>
  <el-select v-model="value" placeholder="Select" style="width: 280px">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
      <div class="custom-option">
        <span>{{ item.label }}</span>
        <span class="custom-option__code">{{ item.code }}</span>
      </div>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('Beijing')
const options = [
  {
    value: 'Beijing',
    label: 'Beijing',
    code: 'BJ',
  },
  {
    value: 'Shanghai',
    label: 'Shanghai',
    code: 'SH',
  },
  {
    value: 'Shenzhen',
    label: 'Shenzhen',
    code: 'SZ',
  },
]
</script>

<style scoped>
.custom-option {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
}

.custom-option__code {
  color: var(--el-text-color-secondary);
  font-size: 13px;
}
</style>
