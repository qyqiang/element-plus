<template>
  <div class="demo-select-v2-status">
    <el-select-v2
      v-model="warningValue"
      :options="options"
      input-type="warning"
      placeholder="Warning state"
    />
    <el-select-v2
      v-model="errorValue"
      :options="options"
      input-type="error"
      placeholder="Error state"
    />
    <el-select-v2
      v-model="filledWarningValue"
      :options="options"
      input-type="warning"
      placeholder="Filled warning"
    />
    <el-select-v2
      v-model="infoValue"
      :options="options"
      input-type="info"
      placeholder="Info state"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const warningValue = ref('')
const errorValue = ref('')
const filledWarningValue = ref('gravel')
const infoValue = ref('cement')

const options = [
  { value: 'sand', label: 'Sand' },
  { value: 'gravel', label: 'Gravel' },
  { value: 'cement', label: 'Cement' },
]
</script>

<style scoped>
.demo-select-v2-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
</style>
