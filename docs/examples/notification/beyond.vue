<template>
  <el-button plain @click="open1"> Success </el-button>
  <el-button plain @click="open2"> Warning </el-button>
  <el-button plain @click="open3"> Info </el-button>
  <el-button plain @click="open4"> Error </el-button>
  <el-button plain @click="open5"> Base </el-button>
  <el-divider />
  <el-button plain @click="open6"> Click me </el-button>
</template>

<script lang="ts" setup>
import { h } from 'vue'
import { ElButton, ElNotification } from 'element-plus'

const open1 = () => {
  ElNotification({
    title: 'Success',
    message: 'This is a success message ',
    type: 'success',
  })
}

const open2 = () => {
  ElNotification({
    title: 'Warning',
    message: 'This is a warning message',
    type: 'warning',
  })
}

const open3 = () => {
  ElNotification({
    title: 'Info',
    message: 'This is an info message',
    type: 'info',
  })
}

const open4 = () => {
  ElNotification({
    title: 'Error',
    message: 'This is an error message',
    type: 'error',
  })
}
const open5 = () => {
  ElNotification({
    title: 'Base',
    message: 'This is an base message',
  })
}

const handleClick = () => {
  console.log('click')
}

const renderMsgContent = ({ message, buttonText, onClick }) => {
  return h('p', {}, [
    message,
    h('div', { class: 'mt-5' }, [
      h(ElButton, { plain: true, onClick }, { default: () => buttonText }),
    ]),
  ])
}
const open6 = () => {
  ElNotification({
    title: 'Click me',
    type: 'success',
    message:
      'This is a message. This is a message. This is a message. This is a message. ',
    label: 'Download',
    onLabelClick: handleClick,
  })
}
</script>
