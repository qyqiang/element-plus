<template>
  <div class="select-v2-have-all-demo">
    <div style="position: relative">
      <el-select-v2
        v-model="emptyValue"
        :options="options"
        multiple
        have-all="(All)"
        placeholder="No selection"
        style="width: 240px"
      />
    </div>


    <el-select-v2
      v-model="selectedValue"
      :options="options"
      multiple
      clearable
      have-all="(All)"
      placeholder="With selection"
      style="width: 240px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const initials = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const emptyValue = ref<string[]>([])
const selectedValue = ref<string[]>(['Option 2'])
const options = ref(
  Array.from({ length: 1000 }).map((_, idx) => ({
    value: `Option ${idx + 1}`,
    label: `${initials[idx % 10]}${idx}`
  }))
)
</script>

<style scoped>
.select-v2-have-all-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
