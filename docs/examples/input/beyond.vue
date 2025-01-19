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

  <el-input
    v-model="textarea1"
    disabled
    :float-label="false"
    style="width: 240px"
    :autosize="{ minRows: 2, maxRows: 4 }"
    type="textarea"
    placeholder="Please input"
  />

  <h5>Width Header</h5>
  <el-divider />
  <div class="flex flex-wrap gap-4 items-center">
    <el-input
      v-model="input5"
      style="width: 240px"
      placeholder="Please Input"
      :prefix-icon="Search"
    />
    <el-form-item style="width: 240px">
      <el-input
        v-model="input5"
        placeholder="Please input"
        :prefix-icon="Search"
        pre-star
      />
    </el-form-item>
    <el-form-item style="width: 240px" error="Input is required">
      <el-input placeholder="Please input" autocomplete="off" />
    </el-form-item>
    <el-input
      v-model="textarea1"
      style="width: 240px"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="Please input"
    >
      <template #header>
        <el-icon><InfoFilled /></el-icon>
      </template>
    </el-input>
    <el-form-item style="width: 240px">
      <el-input
        :prefix-icon="Search"
        type="textarea"
        placeholder="Please input"
        pre-star
      />
    </el-form-item>
    <el-form-item style="width: 240px" error="Input is required">
      <el-input
        v-model="textarea2"
        type="textarea"
        placeholder="Please input"
        autocomplete="off"
      />
    </el-form-item>
    <el-input
      v-model="textarea3"
      disabled
      style="width: 240px"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="Please input"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ArrowDown, InfoFilled, Search } from '@element-plus/icons-vue'

const input = ref('')
const input2 = ref('')
const input3 = ref('')
const input4 = ref('')
const input5 = ref('')
const input6 = ref('')
const input7 = ref('')
const textarea1 = ref('Hello')
const textarea2 = ref()
const textarea3 = ref('Hello')
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
