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
    <el-popover
      :width="400"
      placement="bottom-start"
      popper-class="p-4!"
      trigger="click"
    >
      <template #reference>
        <el-button class="mr-3">
          <span> {{ value1 }}</span>
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
    <h2>Date Range</h2>
    <p>{{ rangeValue }}</p>

    <el-date-picker
      ref="rangePickerRef"
      v-model="rangeValue"
      type="daterange"
      :range-pick-type="rangePickType"
      :is-ok="false"
      :clearable="true"
      @visible-change="handleVisible"
    >
      <template #open>
        <div class="flex">
          <el-input
            v-model="startValue"
            clearable
            class="w-60"
            placeholder="From"
            @click.stop="openRangePicker('start')"
          ></el-input>
          <el-input
            v-model="endValue"
            placeholder="To"
            clearable
            class="w-60"
            @click.stop="openRangePicker('end')"
          ></el-input>
        </div>
      </template>
    </el-date-picker>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue'

const dateRef = ref()
const value1 = ref(['', ''])
const value2 = ref('')
const startValue = ref('')
const endValue = ref('')
const rangeValue = ref<[Date, Date] | ''>('')
const rangePickerRef = ref()
const rangePickType = ref<'start' | 'end'>('start')
const openRangePicker = async (type: 'start' | 'end') => {
  rangePickType.value = type
  await nextTick()
  rangePickerRef.value?.handleOpen()
}
const dropList = [
  { key: 'before', label: 'Before' },
  { key: 'after', label: 'After' },
  { key: 'between', label: 'Between' },
]
const handleVisible = (value: boolean) => {
  if (!value) {
    startValue.value = rangeValue.value[0]
    endValue.value = rangeValue.value[1]
  }
}
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
