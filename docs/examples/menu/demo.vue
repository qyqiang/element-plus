<template>
  <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :value="false">expand</el-radio-button>
    <el-radio-button :value="true">collapse</el-radio-button>
  </el-radio-group>
  <el-button @click="handleFixed(true)">Fixed Menu</el-button>
  <el-button @click="handleFixed(false)">Cancel Fixed Menu</el-button>
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="isCollapse"
    @open="handleOpen"
    @close="handleClose"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
  >
    <el-divider style="margin: 8px 0" />
    <el-menu-item index="10">
      <el-icon>
        <Location />
      </el-icon>
      <template #title>Dashboard</template>
    </el-menu-item>
    <el-menu-item index="1">
      <el-icon>
        <icon-menu />
      </el-icon>
      <template #title>Navigator One</template>
    </el-menu-item>
    <el-divider style="margin: 8px 0" />
    <el-popover
      width="240px"
      trigger="click"
      teleported
      effect="light"
      popper-class="menu-popper"
      placement="right-start"
    >
      <template #reference>
        <el-menu-item index="2">
          <el-icon>
            <icon-menu />
          </el-icon>
          <template #title>
            <span>
              Navigator Two
              <el-icon style="margin-left: 4px; margin-right: 0">
                <CaretRight />
              </el-icon>
            </span>
          </template>
        </el-menu-item>
      </template>
      <div class="sub-wrap">
        <p class="title">subTitle</p>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          :collapse="false"
        >
          <el-menu-item index="10">
            <template #title>Dashboard</template>
          </el-menu-item>
          <el-menu-item index="1">
            <template #title>Navigator One</template>
          </el-menu-item>
          <el-menu-item index="3">
            <template #title>Navigator Three</template>
          </el-menu-item>
          <el-menu-item index="4">
            <template #title>Navigator Four</template>
          </el-menu-item>
        </el-menu>
      </div>
    </el-popover>

    <el-menu-item index="3">
      <el-icon>
        <document />
      </el-icon>
      <template #title>Navigator Three</template>
    </el-menu-item>
    <el-divider style="margin: 8px 0" />
    <el-menu-item index="4">
      <el-icon>
        <setting />
      </el-icon>
      <template #title>Navigator Four</template>
    </el-menu-item>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import {
  CaretRight,
  Document,
  Menu as IconMenu,
  Location,
  Setting,
} from '@element-plus/icons-vue'

const isCollapse = ref(true)
const isFlag = ref(false)
const visible = ref(false)
const subTitle = ref('test')
const handleItem = () => {
  visible.value = true
}
const handleFixed = (flag: boolean) => {
  isFlag.value = flag
  isCollapse.value = !flag
}
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleEnter = () => {
  // isCollapse.value = false
}
const handleLeave = () => {
  if (isFlag.value) return
  isCollapse.value = true
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
</script>

<style scoped>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 182px;
}

.sub-wrap {
  width: 240px;
}
</style>
