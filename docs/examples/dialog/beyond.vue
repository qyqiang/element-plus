<template>
  <el-button plain @click="handleOpen('warning')">
    HeaderType: warning
  </el-button>
  <el-button plain @click="handleOpen('error')"> HeaderType: error </el-button>
  <el-divider />

  <el-dialog
    v-model="centerDialogVisible"
    :title="`${headerType} type`"
    width="380"
    align-center
    :header-type="headerType"
  >
    <span>
      Lorem ipsum dolor. Sit amet magna donec neque ut nunc dui eget. Ut dui eu
      torquent neque maecenas. Scelerisque adipiscing est quam sed orci. Nonummy
      nibh litora netus arcu vitae. Congue et sed. Litora mi eu mauris nascetur
      id.
    </span>
    <el-divider />
    <div class="hints">
      <div class="header">Hints</div>
      <ul class="line-clamp-7">
        <li v-for="item in HINTS" :key="item.id">{{ item.value }}</li>
      </ul>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="centerDialogVisible = false">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const centerDialogVisible = ref(false)
const headerType = ref('error')
const HINTS = [
  {
    id: 1,
    value:
      'Lorem ipsum dolor. Sit amet magna donec neque ut nunc dui eget. Ut dui eu torquent neque maecenas.',
  },
  {
    id: 2,
    value:
      'Lorem ipsum dolor. Sit amet magna donec neque ut nunc dui eget. Ut dui eu torquent neque maecenas.',
  },
  {
    id: 3,
    value:
      'Lorem ipsum dolor. Sit amet magna donec neque ut nunc dui eget. Ut dui eu torquent neque maecenas.',
  },
]
const handleOpen = (type) => {
  centerDialogVisible.value = true
  headerType.value = type
}
</script>
