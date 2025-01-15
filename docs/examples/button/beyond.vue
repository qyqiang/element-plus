<template>
  <div>
    <h5>Primary</h5>
    <el-button type="primary">Primary</el-button>
    <el-button type="primary" disabled>Disabled</el-button>
    <el-button type="primary" loading>Loading</el-button>
    <el-button type="primary" :icon="Edit">Loading</el-button>
    <el-button type="primary" :icon="Edit" disabled>Loading</el-button>
    <el-button type="primary">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button type="primary" disabled>
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button type="primary" :icon="Delete" disabled />
    <el-button type="primary" :icon="Delete" />
    <el-divider />
  </div>

  <div>
    <h5>Outlined</h5>
    <el-button plain>Outlined</el-button>
    <el-button plain disabled>Disabled</el-button>
    <el-button plain class="active">Active</el-button>
    <el-button plain loading>Loading</el-button>
    <el-button plain :icon="Edit">Loading</el-button>
    <el-button plain :icon="Edit" disabled>Loading</el-button>
    <el-button plain>
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button plain disabled>
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button plain>
      <el-checkbox label="Label" />
    </el-button>
    <el-button plain disabled>
      <el-checkbox disabled label="Label" />
    </el-button>
    <el-button plain :icon="Delete" disabled />
    <el-button plain :icon="Delete" />
    <el-divider />
  </div>

  <div>
    <h5>Filled Tonal</h5>
    <el-button type="filled">Filled</el-button>
    <el-button type="filled" disabled>Disabled</el-button>
    <el-button type="filled" loading>Loading</el-button>
    <el-button type="filled" :icon="Edit">Loading</el-button>
    <el-button type="filled" :icon="Edit" disabled>Loading</el-button>
    <el-button type="filled">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button type="filled" disabled>
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button type="filled">
      <el-checkbox label="Label" />
    </el-button>
    <el-button type="filled" disabled>
      <el-checkbox disabled label="Label" />
    </el-button>
    <el-button type="filled" :icon="Delete" disabled />
    <el-button type="filled" :icon="Delete" />
    <el-divider />
  </div>

  <div>
    <h5>Text</h5>
    <el-button type="text">Text</el-button>
    <el-button type="text" disabled>Disabled</el-button>
    <el-button type="text" class="active">Active</el-button>
    <el-button type="text" loading>Loading</el-button>
    <el-button type="text" :icon="Edit">Loading</el-button>
    <el-button type="text" :icon="Edit" disabled>Loading</el-button>
    <el-button type="text">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button type="text" disabled>
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button type="text">
      <el-checkbox label="Label" />
    </el-button>
    <el-button type="text" disabled>
      <el-checkbox disabled label="Label" />
    </el-button>
    <el-button type="text" :icon="Delete" disabled />
    <el-button type="text" :icon="Delete" />
    <el-divider />
  </div>

  <div>
    <h5>Button Tag</h5>
    <el-button class="beyond-button-tag" round :style="statusColor['-20']">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button
      class="beyond-button-tag"
      round
      disabled
      :style="statusColor['-20']"
    >
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button class="beyond-button-tag" round :style="statusColor[1]">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button class="beyond-button-tag" round :style="statusColor[5]">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button class="beyond-button-tag" round :style="statusColor[10]">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
    <el-button class="beyond-button-tag" round :style="statusColor['-99']">
      Label<el-icon><ArrowDown /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { ArrowDown, Delete, Edit } from '@element-plus/icons-vue'

const statusColor = {
  '-20': {
    backgroundColor: '#d4e4fa',
    color: '#0d4ea6',
    circleColor: '#186ADE',
  },
  1: { backgroundColor: '#e7ecef', color: '#3e5463', circleColor: '#C1CCD6' },
  5: { backgroundColor: '#c7e8ed', color: '#09596b', circleColor: '#09596b' },
  10: { backgroundColor: '#c7ebd1', color: '#075e45', circleColor: '#16A163' },
  '-99': {
    backgroundColor: '#fadcd9',
    color: '#a1160a',
    circleColor: '#D91F11',
  },
}
</script>
