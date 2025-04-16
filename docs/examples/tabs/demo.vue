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
        <div class="custom-tabs-label">
          <el-icon>
            <calendar />
          </el-icon>
          <span>Route</span>
        </div>
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
  <el-divider />
  <p style="margin-bottom: 24px; color: orange">
    For count ,add class name 'tab-count', For only icon ,'el-tab-pane' add
    'tabPaneClass' name 'tabOnlyIcon',
  </p>
  <el-tabs v-model="editableTabsValue" type="border-card" class="demo-tabs1">
    <el-tab-pane tab-pane-class="tabOnlyIcon" label="22">
      <template #label>
        <el-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <g clip-path="url(#clip0_13466_17378)">
              <path
                d="M14 6.125H7.875V0H6.125V6.125H0V7.875H6.125V14H7.875V7.875H14V6.125Z"
                fill="#374957"
              />
            </g>
            <defs>
              <clipPath id="clip0_13466_17378">
                <rect width="14" height="14" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </el-icon>
      </template>
    </el-tab-pane>
    <el-tab-pane>
      <template #label>
        <div style="display: flex">
          <span>Label</span>
          <div class="tab-count"><span>12</span></div>
        </div>
      </template>
    </el-tab-pane>
  </el-tabs>
  <el-divider />
  <el-tabs
    v-model="activeName"
    type="card"
    class="demo-tabs"
    @tab-click="handleClick"
  >
    <el-tab-pane label="User" name="first">User</el-tab-pane>
    <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
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
const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
</script>
