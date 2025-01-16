<template>
  <h5>Clean</h5>
  <el-input
    v-model="input"
    :float-label="false"
    style="width: 240px"
    placeholder="Please input"
  />
  <el-input
    v-model="input2"
    :float-label="false"
    style="width: 240px"
    placeholder="Please input"
    :prefix="$"
  >
    <template #prefix>
      <span>$</span>
    </template>
  </el-input>
  <el-input
    v-model="input3"
    :float-label="false"
    style="width: 240px"
    placeholder="Please input"
    :prefix="$"
  >
    <template #suffix>
      <el-icon><ArrowDown /></el-icon>
    </template>
  </el-input>

  <el-input
    v-model="input4"
    :float-label="false"
    style="width: 240px"
    :prefix-icon="Search"
    placeholder="Please input"
    :prefix="$"
  >
    <template #suffix>
      <el-icon><ArrowDown /></el-icon>
    </template>
  </el-input>
  <el-input
    v-model="input5"
    :float-label="false"
    style="width: 240px"
    :prefix-icon="Search"
    placeholder="Please input"
    :prefix="$"
  >
    <template #suffix>
      Unit<el-icon><ArrowDown /></el-icon>
    </template>
  </el-input>

  <el-input
    v-model="input6"
    disabled
    :float-label="false"
    style="width: 240px"
    :prefix-icon="Search"
    placeholder="Please input"
    :prefix="$"
  >
    <template #suffix>
      Unit<el-icon><ArrowDown /></el-icon>
    </template>
  </el-input>
  <el-input
    v-model="input7"
    aria-required="true"
    :float-label="false"
    style="width: 240px"
    :prefix-icon="Search"
    placeholder="Please input"
    :prefix="$"
  >
    <template #suffix>
      Unit<el-icon><ArrowDown /></el-icon>
    </template>
  </el-input>
  <el-form-item style="width: 240px" error="Input is required">
    <el-input type="password" autocomplete="off" />
  </el-form-item>

  <h5>Width Header</h5>
  <el-divider />
  <el-input
    v-model="input5"
    style="width: 240px"
    placeholder="Please Input"
    :prefix-icon="Search"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowDown, Search } from '@element-plus/icons-vue'

const input = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
const input5 = ref('')
const input6 = ref('')
const input7 = ref('')
</script>

<style scoped lang="scss">
.el-input {
  margin: 0 20px 20px 0;
}
.el-form-item__content {
  .el-input {
    margin: auto;
  }
}
</style>
