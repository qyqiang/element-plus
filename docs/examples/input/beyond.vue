<template>
  <h5>Width Header</h5>
  <el-divider />
  <div class="flex flex-wrap gap-4 items-center">
    <el-input
      v-model="input5"
      style="width: 240px"
      placeholder="Please Input"
      pre-star
      :prefix-icon="Search"
      clearable
    />
    <el-form-item style="width: 240px">
      <el-input
        v-model="input5"
        clearable
        placeholder="Please input"
        :prefix-icon="Search"
        pre-star
      >
        <template #suffix>
          <el-icon size="12px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 12 12"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 6C12 9.31371 9.31371 12 6 12C2.68629 12 0 9.31371 0 6C0 2.68629 2.68629 0 6 0C9.31371 0 12 2.68629 12 6ZM6.5 2.5V7H5.5V2.5H6.5ZM6.5 9V8H5.5V9H6.5Z"
              />
            </svg>
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="width: 240px" error="Input is required">
      <el-input
        v-model="input5"
        clearable
        placeholder="Please input"
        :prefix-icon="Search"
        pre-star
      >
        <template #suffix>
          <el-icon>
            <warning-filled />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item style="width: 240px" error="Input is required">
      <el-input
        v-model="input5"
        placeholder="Please input"
        autocomplete="off"
        clearable
      />
    </el-form-item>
    <el-divider />
    <h2>Input Tag</h2>
    <el-input-tag
      v-model="inputTag"
      placeholder="Please input tag"
      aria-label="Please click the Enter key after input"
    />
    <el-divider />
    <el-input
      v-model="textarea1"
      pre-star
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
        pre-star
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
        <el-icon>
          <Search />
        </el-icon>
      </template>
      <template #textareaSuffix>
        <el-tooltip
          content="info xx"
          effect="light"
          placement="top"
          :offset="4"
        >
          <el-icon>
            <WarningFilled />
          </el-icon>
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
const input5 = ref('')
const textarea1 = ref('Hello')
const textarea2 = ref()
const textarea3 = ref('Hello')
const inputTag = ref<string[]>(['testValue'])
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
