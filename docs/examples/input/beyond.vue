<template>
  <h5>Status Input</h5>
  <el-divider />
  <div class="flex flex-wrap gap-4 items-center">
    <el-input v-model="input" style="width: 240px" placeholder="Please input" />
    <el-input v-model="input" style="width: 240px" placeholder="Append input">
      <template #append> TEST </template>
    </el-input>
    <el-input
      v-model="input"
      input-type="warning"
      style="width: 240px"
      placeholder="Warning Input"
      clearable
    />
    <el-input
      v-model="input"
      input-type="error"
      style="width: 240px"
      placeholder="Error Input"
      clearable
    />
    <el-input
      input-type="error"
      style="width: 240px"
      placeholder="Hover me when empty"
    />
    <el-input
      v-model="input"
      input-type="error"
      info-tip="Custom required message"
      style="width: 240px"
      placeholder="Custom empty error tip"
    />
    <el-input
      v-model="input6"
      disabled
      style="width: 240px"
      placeholder="Please Input"
      pre-star
      :prefix-icon="Search"
      clearable
    />
    <el-input
      v-model="input5"
      style="width: 240px"
      placeholder="Please Input"
      pre-star
      :prefix-icon="Search"
      clearable
    />
    <el-input
      v-model="input"
      style="width: 240px"
      type="password"
      placeholder="Please input password"
      show-password
    />
    <el-form-item style="width: 240px">
      <el-input
        v-model="input5"
        input-type="info"
        info-tip="Important Information"
        clearable
        placeholder="Please input"
        :prefix-icon="Search"
        pre-star
      />
    </el-form-item>
    <el-form-item style="width: 240px" error="Input is required">
      <el-input
        v-model="input5"
        input-type="info"
        info-tip="Important Information"
        clearable
        placeholder="Please input"
        :prefix-icon="Search"
        pre-star
      />
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
  <h5>Float Label Off</h5>
  <el-divider />
  <el-input
    v-model="input"
    :float-label="false"
    style="width: 240px"
    placeholder="Please input"
  />
  <h5>Length Limit</h5>
  <el-divider />
  <el-input
    v-model="text"
    style="width: 240px"
    maxlength="10"
    placeholder="Please input"
    show-word-limit
    type="text"
  />
  <el-input
    v-model="text"
    class="ml-4"
    style="width: 240px"
    maxlength="10"
    placeholder="Please input"
    show-word-limit
    word-limit-position="outside"
    type="text"
  />
  <el-input
    v-model="textarea"
    class="ml-4"
    maxlength="30"
    style="width: 240px"
    placeholder="Please input"
    show-word-limit
    word-limit-position="outside"
    type="textarea"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search, WarningFilled } from '@element-plus/icons-vue'

const text = ref('')
const textarea = ref('')
const input = ref('')
const input5 = ref('')
const input6 = ref(0)
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
