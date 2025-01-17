<template>
  <h5>Base</h5>
  <div class="flex flex-wrap gap-4 items-center">
    <el-select
      v-model="value"
      :float-label="false"
      clearable
      placeholder="Please Select"
      label="label1"
      label-suffix="Unit"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>

    <el-select
      v-model="value2"
      :float-label="false"
      label-suffix="Unit"
      placeholder="Select"
      style="width: 240px"
      disabled
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #prefix>
        <span>$</span>
      </template>
    </el-select>
  </div>

  <el-divider />
  <h5>Width Header</h5>
  <div class="flex flex-wrap gap-4 items-center">
    <el-select
      v-model="value2"
      :float-label="true"
      placeholder="Select"
      label-suffix="Unit"
      style="width: 240px"
      clearable
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #prefix>
        <span>$</span>
      </template>
    </el-select>
    <el-select
      v-model="value3"
      placeholder="Select"
      label-suffix="Unit"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      v-model="value4"
      placeholder="Select"
      label-suffix="Unit"
      :suffix-icon="Search"
      style="width: 240px"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #info>
        <el-icon><InfoFilled /></el-icon>
      </template>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { InfoFilled, Search } from '@element-plus/icons-vue'

const value = ref('')
const value2 = ref('')
const value3 = ref('')
const value4 = ref('')

const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]
</script>

<style scoped>
h5 {
  margin-bottom: 10px;
}
</style>
