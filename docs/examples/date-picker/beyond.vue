<template>
  <div class="demo-date-picker">
    <div class="mb-4">
      If the prop `typeList` is valid, the value of `type` is the first term of
      the `typeList`.
    </div>
    <el-date-picker v-model="value1" :type-list="typeList" placeholder="Pick" />
    <el-divider />
    <div class="demonstration">Picker with quick options</div>
    <div class="mb-4">Current SelectType: {{ dateRef?.selectType }}</div>
    <el-date-picker
      ref="dateRef"
      v-model="value2"
      :type-list="typeList"
      placeholder="Pick"
      :disabled-date="disabledDate"
      :shortcuts="shortcuts"
      type="date"
    />
    <div class="demonstration mt-2">Custom Open Component</div>
    <el-divider />
    <el-date-picker ref="datePicker" v-model="value2" type="date">
      <template #open>
        <div>custom open</div>
      </template>
    </el-date-picker>
    <div class="demonstration mt-2">Date Range</div>
    <el-divider />
    <!--    <el-date-picker-->
    <!--      v-model="rangeValue"-->
    <!--      type="daterange"-->
    <!--      :is-ok="false"-->
    <!--      :clearable="true"-->
    <!--      float-label="Start date"-->
    <!--      range-separator=""-->
    <!--      start-placeholder="Start date"-->
    <!--    >-->
    <!--      <template #open>-->
    <!--       -->
    <!--      </template>-->
    <!--    </el-date-picker>-->
    <el-popover
      :width="400"
      placement="bottom-start"
      popper-class="p-4!"
      trigger="click"
    >
      <template #reference>
        <el-button class="mr-3">
          <span>ddd</span>
        </el-button>
      </template>
      <div class="flex w-full flex-col">
        <div class="dateListRange flex w-full">
          <el-date-picker
            v-model="value1"
            :teleported="false"
            type="datestartrange"
            placeholder="Start"
          />
          <el-date-picker
            v-model="value1"
            :teleported="false"
            type="dateendrange"
            placeholder="End"
          />
        </div>
        <div class="flex-center mt-2 justify-end">
          <el-button @click="handleClear">Clear</el-button>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const dateRef = ref()
const value1 = ref(['', ''])
const value2 = ref('')
const rangeValue = ref<[Date, Date] | ''>('')
const dropList = [
  { key: 'before', label: 'Before' },
  { key: 'after', label: 'After' },
  { key: 'between', label: 'Between' },
]
const activeTitle = computed(() => {
  return dropList[0]
})
const handleCommand = () => {}
const handleClear = () => {}
const typeList = [
  { key: 'date', label: 'Day' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
]
const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const selectBeforeToday = () => {
  const today = new Date()
  const currentDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  rangeValue.value = [new Date(1970, 0, 1), currentDay]
}

const selectAfterToday = () => {
  const today = new Date()
  const currentDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  rangeValue.value = [currentDay, new Date(2099, 11, 31)]
}
</script>
