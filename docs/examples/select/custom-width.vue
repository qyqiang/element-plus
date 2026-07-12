<template>
  <div class="select-custom-width-demo">
    <el-select
      v-model="numericValue"
      :fit-input-width="false"
      :option-width="320"
      placeholder="Numeric width"
      style="width: 220px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-model="stringValue"
      :fit-input-width="false"
      option-width="360px"
      placeholder="String width"
      style="width: 220px"
    >
      <el-option
        v-for="item in options"
        :key="`${item.value}-string`"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const numericValue = ref('')
const stringValue = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option 1 with a longer dropdown label',
  },
  {
    value: 'Option2',
    label: 'Option 2 with a longer dropdown label',
  },
  {
    value: 'Option3',
    label: 'Option 3 with a longer dropdown label',
  },
]
</script>

<style scoped>
.select-custom-width-demo {
  display: grid;
  gap: 12px;
}
</style>
