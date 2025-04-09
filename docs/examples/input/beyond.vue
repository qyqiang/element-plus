<template>
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
    />
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
      style="width: 240px"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="Please input"
    >
      <template #textareaPrefix>
        <el-icon><Search /></el-icon>
      </template>
      <template #textareaSuffix>
        <el-tooltip
          content="info xx"
          effect="light"
          placement="top"
          :offset="4"
        >
          <el-icon><WarningFilled /></el-icon>
        </el-tooltip>
      </template>
    </el-input>
    <el-input
      v-model="textarea3"
      disabled
      style="width: 240px"
      :autosize="{ minRows: 2, maxRows: 4 }"
      type="textarea"
      placeholder="Please input"
    />
  </div>

  <el-divider />
  <h5>Clean</h5>
  <el-divider />
  <el-input
    v-model="input"
    :float-label="false"
    style="width: 240px"
    placeholder="Please input"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  ArrowDown,
  InfoFilled,
  Search,
  WarningFilled,
} from '@element-plus/icons-vue'

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
