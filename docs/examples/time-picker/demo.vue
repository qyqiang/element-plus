<!-- prettier-ignore -->
/**
* time.vue
* Copyright (c) 2023 BeyondTrucks. All rights reserved.
*
* @author Yingqiang Qi
* @since 2023/5/16 14:17
*/
<template>
  <el-select
    ref="selectRef"
    v-model="timeValue"
    :class="{ timeSuffix: needTimeSuffix }"
    :clearable="true"
    :placeholder="label"
    class="time-picker-select"
    popper-class="time-picker-item"
    filterable
    @blur="handleBlurTime(timeValue)"
    @change="handleChange"
    @focus="handleFocusTime"
    @input="handleInputTime"
    @visible-change="handleSelectVisibleChange"
  >
    <el-option
      v-for="itm in timeArrList"
      :key="itm"
      :label="itm"
      :value="itm"
    />
  </el-select>
</template>
<script lang="ts" name="BTime" setup>
import { ref } from 'vue'

const generateTimeArray = () => {
  const timeArr = []
  for (let i = 0; i < (24 * 60) / 30; i++) {
    const hour = Math.floor(i / 2)
    const minute = i % 2 ? '30' : '00'
    if (!(hour >= 12 && !minute)) {
      const formattedHour = String(hour).padStart(2, '00')
      timeArr.push(`${formattedHour}:${minute}`)
    }
  }
  return timeArr
}

const props = defineProps({
  data: { type: String },
  label: { type: String, default: 'Time' },
  needTimeSuffix: { type: Boolean, default: false },
})
const selectRef = ref(null)
const toggleMenu = () => {
  selectRef.value?.toggleMenu()
}
const timeArrList = ref([])
const timeTemp = ref('')
const emit = defineEmits(['update:data', 'change', 'visibleChange'])
const timeValue = ref('')
const handleChange = () => {
  emit('change')
}
const handleSelectVisibleChange = (val: boolean) => {
  emit('visibleChange', val)
}
const handleBlurTime = (evt: string) => {
  if (!evt) return
  if (!timeArrList.value.includes(evt)) {
    timeArrList.value.unshift(evt)
  }
  if (!timeArrList.value.includes(timeTemp.value) && timeTemp.value) {
    timeValue.value = evt
    timeArrList.value.unshift(timeTemp.value)
  }
}
const handleFocusTime = (evt: any) => {
  timeTemp.value = null
  timeArrList.value = generateTimeArray()
  if (!timeArrList.value.includes(evt.target.value) && !!evt.target.value) {
    timeArrList.value.unshift(evt.target.value)
  }
}
const handleInputTime = (evt: any) => {
  evt.target.maxLength = 5
  // new Cleave(evt.target, {
  //   time: true,
  //   timePattern: ['h', 'm'],
  // })
  if (evt.target.value?.length === 5) {
    timeTemp.value = evt.target.value
    timeArrList.value = generateTimeArray()
    if (!timeArrList.value.includes(evt.target.value)) {
      timeArrList.value.unshift(evt.target.value)
    }
    // waiting for timeArrList completed in dom
    setTimeout(() => {
      timeValue.value = evt.target.value
    }, 0)
  }
}

defineExpose({
  toggleMenu,
})
</script>

<style lang="scss">
.timeSuffix .el-input .el-input__suffix-inner::after {
  content: '';
  width: 16px;
  height: 16px;
  margin-left: 0.75rem;
  background-size: contain;
  color: #2a3f4d;
  background-position: center center;
  //background-image: url("@/assets/icons/fi-ss-clock.svg");
  background-image: url('data:image/svg+xml;base64,PHN2Zw0KICAgICAgICBmaWxsPSIjMkEzRjREIg0KICAgICAgICB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCiAgICA8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfMTAyMl8zMDcpIj4NCiAgICAgICAgPHBhdGggZD0iTTEyIDBDOS42MjY2MyAwIDcuMzA2NTUgMC43MDM3ODggNS4zMzMxNiAyLjAyMjM2QzMuMzU5NzcgMy4zNDA5NCAxLjgyMTcgNS4yMTUwOSAwLjkxMzQ1MSA3LjQwNzhDMC4wMDUxOTk0MyA5LjYwMDUxIC0wLjIzMjQ0MSAxMi4wMTMzIDAuMjMwNTgyIDE0LjM0MTFDMC42OTM2MDUgMTYuNjY4OSAxLjgzNjQ5IDE4LjgwNzEgMy41MTQ3MiAyMC40ODUzQzUuMTkyOTUgMjIuMTYzNSA3LjMzMTE1IDIzLjMwNjQgOS42NTg5MiAyMy43Njk0QzExLjk4NjcgMjQuMjMyNCAxNC4zOTk1IDIzLjk5NDggMTYuNTkyMiAyMy4wODY2QzE4Ljc4NDkgMjIuMTc4MyAyMC42NTkxIDIwLjY0MDIgMjEuOTc3NiAxOC42NjY4QzIzLjI5NjIgMTYuNjkzNSAyNCAxNC4zNzM0IDI0IDEyQzI0IDguODE3NCAyMi43MzU3IDUuNzY1MTYgMjAuNDg1MyAzLjUxNDcyQzE4LjIzNDkgMS4yNjQyOCAxNS4xODI2IDAgMTIgMFYwWk0xMyAxMi40MzNMNy45NDcwMSAxNS42TDYuODg2MDEgMTMuOUwxMSAxMS4zMjVWNkgxM1YxMi40MzNaIg0KICAgICAgICAvPg0KICAgIDwvZz4NCiAgICA8ZGVmcz4NCiAgICAgICAgPGNsaXBQYXRoIGlkPSJjbGlwMF8xMDIyXzMwNyI+DQogICAgICAgICAgICA8cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IndoaXRlIi8+DQogICAgICAgIDwvY2xpcFBhdGg+DQogICAgPC9kZWZzPg0KPC9zdmc+DQo=');
}
</style>
