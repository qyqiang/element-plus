<template>
  <div class="flex gap-2">
    <span>Normal: </span>
    <el-tag v-for="item in items" :key="item.label" :type="item.type" round>
      {{ item.label }}
    </el-tag>
  </div>
  <el-divider />
  <div class="flex gap-2">
    <el-tag v-for="item in items" :key="item.label" :type="item.type" round>
      <span class="icon-plus">+</span> {{ item.label }}
    </el-tag>
  </div>
  <el-divider />
  <div class="flex gap-2">
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      round
      closable
      @close="handleClose(tag)"
    >
      {{ item.label }}
    </el-tag>
  </div>
  <el-divider />
  <div class="flex gap-2 items-center">
    <span>Large:</span>
    <el-tag
      v-for="item in items"
      :key="item.label"
      :type="item.type"
      size="large"
      round
    >
      {{ item.label }}
    </el-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const items = ref([
  { type: 'gray', label: 'Tag 1' },
  { type: 'blue', label: 'Tag 2' },
  { type: 'cyan', label: 'Tag 3' },
  { type: 'green', label: 'Tag 4' },
  { type: 'orange', label: 'Tag 5' },
  { type: 'red', label: 'Tag 5' },
])

const handleClose = (tag: string) => {
  items.value.splice(items.value.indexOf(tag), 1)
}
</script>
