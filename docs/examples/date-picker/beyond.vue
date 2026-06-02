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
    <el-date-picker
      v-model="rangeValue"
      type="daterange"
      :is-ok="false"
      :clearable="true"
      float-label="Start date"
      range-separator=""
      start-placeholder="Start date"
    >
      <template #open> sasasa </template>
      <template #option>
        <div>
          <el-button @click="selectBeforeToday">Before</el-button>
          <el-button @click="selectAfterToday">After</el-button>
          <el-dropdown
            :popper-options="{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 4],
                  },
                },
              ],
            }"
            placement="bottom-start"
            trigger="click"
            @command="handleCommand"
          >
            <div
              class="flex-center rounded-20 style-span h-8 min-w-[77px] cursor-pointer px-3 py-2.5 text-xs font-semibold"
            >
              {{ activeTitle?.label }}
              <svg-icon class="ml-1" color="#2A3F4D" name="fi-ss-angle-down" />
            </div>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in dropList"
                  :key="item.key"
                  :command="item.key"
                >
                  <div class="flex-center w-full justify-between">
                    <span
                      class="flex-center rounded-10 h-5 px-2 py-0.5 text-xs font-medium"
                    >
                      {{ item.label }}
                    </span>
                    <svg-icon
                      v-if="item.label === activeTitle.label"
                      color="#2A3F4D"
                      name="fi-ss-check"
                      size="16px"
                    />
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </el-date-picker>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

const dateRef = ref()
const value1 = ref('')
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
