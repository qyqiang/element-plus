<template>
  <div class="demo-pagination-block">
    <div class="demonstration">Total item count</div>
    <el-pagination
      :current-page="currentPage"
      :page-size="30"
      :page-sizes="[30, 60, 90]"
      layout="slot, prev, pager, next,sizes"
      :total="1000"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <template #default>
        <div class="noto-14-20">
          {{ (currentPage - 1) * pageSize + 1 }} -
          {{ limitSizes }} &nbsp;of&nbsp; {{ formatIntNumber(total) }} items
        </div>
      </template>
    </el-pagination>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { ComputedRef } from 'vue'
import type { ComponentSize } from 'element-plus'

const formatIntNumber = (s: any) => {
  if (s === '' || s === null || s === undefined) return ''
  let isNag = false
  if (+s < 0) {
    isNag = true
    s = Math.abs(s)
  }
  const l = s.toString().split('').reverse()
  let t = ''
  for (let i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '')
  }
  return `${isNag ? '-' : ''}${t.split('').reverse().join('')}`
}
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageCount: {
    type: Number,
    default: 7,
  },
  pageSizes: {
    type: Array<number>,
    default: [30, 50, 90],
  },
  currentPage: { type: Number, default: 1 },
  updateTime: { type: String },
  rowClass: { type: String, default: 'w-full align-center pv32' },
  layout: { type: String, default: 'slot, prev, pager, next, sizes' },
  isUpdateTime: { type: Boolean, default: false },
  isPage: { type: Boolean, default: true },
  pageSize: { type: Number, default: 30 },
})

const limitSizes: ComputedRef<number> = computed(() => {
  const currentAllPage =
    (props.currentPage - 1) * props.pageSize + props.pageSize
  return props.total
    ? currentAllPage > props.total
      ? props.total
      : currentAllPage
    : 0
})
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
}
</script>

<style scoped>
.demo-pagination-block + .demo-pagination-block {
  margin-top: 10px;
}

.demo-pagination-block .demonstration {
  margin-bottom: 16px;
}
.noto-14-20 {
  font-family: var(--body-font);
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0.005em;
  color: #000;
}
</style>
