<template>
  <el-tabs
    v-model="editableTabsValue"
    type="border-card"
    class="demo-tabs1"
    addable
    @tab-add="handleTabsEdit"
  >
    <template #add-icon>
      <el-icon><Select /></el-icon>
    </template>
    <el-tab-pane>
      <template #label>
        <span class="custom-tabs-label">
          <el-icon><calendar /></el-icon>
          <span>Route</span>
        </span>
      </template>
    </el-tab-pane>
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Calendar, Select } from '@element-plus/icons-vue'
const editableTabsValue = ref('2')
let tabIndex = 2
const editableTabs = ref([
  {
    title: 'Tab 1',
    name: '1',
    content: 'Tab 1 content',
  },
  {
    title: 'Tab 2',
    name: '2',
    content: 'Tab 2 content',
  },
])
const handleTabsEdit = (targetName: any) => {
  const newTabName = `${++tabIndex}`
  editableTabs.value.push({
    title: 'New Tab',
    name: newTabName,
    content: 'New Tab content',
  })
  editableTabsValue.value = newTabName
}
</script>

<style>
.demo-tabs1 .custom-tabs-label .el-icon {
  vertical-align: middle;
}

.demo-tabs1 .custom-tabs-label span {
  vertical-align: middle;
  margin-left: 4px;
}
</style>
