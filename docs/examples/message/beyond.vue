<template>
  <el-button :plain="true" @click="open1">Message</el-button>
  <el-button :plain="true" @click="open2">Success</el-button>
  <el-button :plain="true" @click="open3">Warning</el-button>
  <el-button :plain="true" @click="open4">Error</el-button>
  <el-divider />
  <div class="mb-4">effect: 'dark'</div>
  <el-button :plain="true" @click="open5">Message</el-button>
  <el-button :plain="true" @click="open6">Success</el-button>
  <el-button :plain="true" @click="open7">Warning</el-button>
  <el-button :plain="true" @click="open8">Error</el-button>
  <el-divider />
  <div class="mb-4">Text wrap</div>
  <el-button :plain="true" @click="open9">Success</el-button>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'

const open1 = () => {
  ElMessage('This is a message.')
}
const open2 = () => {
  ElMessage({
    showClose: true,
    message: 'Congrats, this is a success message.',
    type: 'success',
    title: 'Title success text',
    onLabelClick: () => console.log('click'),
    duration: 0,
    label: 'Download',
  })
}
const open3 = () => {
  ElMessage({
    showClose: true,
    message: 'Warning, this is a warning message.',
    type: 'warning',
    title: 'Title',
    label: 'Download',
  })
}
const open4 = () => {
  ElMessage({
    showClose: true,
    message: 'Oops, this is a error message.',
    type: 'error',
    title: 'Title',
    label: 'Download',
  })
}

// effect: 'dark',
const open5 = () => {
  ElMessage({
    effect: 'dark',
    showClose: true,
    message: 'Congrats, this is a success message.',
    type: 'info',
    title: 'Title info',
    label: 'Download',
    onLabelClick: () => console.log('click'),
  })
}
const open6 = () => {
  ElMessage({
    effect: 'dark',
    showClose: true,
    message: 'Congrats, this is a success message.',
    type: 'success',
    title: 'Title',
    label: 'Download',
    duration: 0,
  })
}
const open7 = () => {
  ElMessage({
    effect: 'dark',
    showClose: true,
    message: 'Warning, this is a warning message.',
    type: 'warning',
    title: 'Title',
    label: 'Download',
  })
}
const open8 = () => {
  ElMessage({
    effect: 'dark',
    showClose: true,
    message: 'Oops, this is a error message.',
    type: 'error',
    title: 'Title',
    label: 'Download',
  })
}
const open9 = () => {
  ElMessage({
    showClose: true,
    effect: 'dark',
    message:
      'Congrats, this is a success message. Congrats, this is a success message. ' +
      'Congrats, this is a success message. Congrats, this is a success message. ' +
      'Congrats, this is a success message.Congrats, this is a success message.',
    type: 'success',
    title: 'Title success text',
    onLabelClick: () => console.log('click'),
    label: 'Download',
  })
}
</script>
