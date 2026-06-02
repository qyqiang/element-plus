<template>
  <div
    :class="[
      ppNs.b(),
      drpNs.b(),
      {
        'has-sidebar': $slots.sidebar || hasShortcuts,
        'has-time': showTime,
      },
    ]"
  >
    <div :class="ppNs.e('body-wrapper')">
      <slot name="sidebar" :class="ppNs.e('sidebar')" />
      <div v-if="hasShortcuts" :class="ppNs.e('sidebar')">
        <button
          v-for="(shortcut, key) in shortcuts"
          :key="key"
          type="button"
          :class="ppNs.e('shortcut')"
          @click="handleShortcutClick(shortcut)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <slot name="option"></slot>
      <div :class="ppNs.e('body')">
        <div v-if="showTime" :class="drpNs.e('time-header')">
          <span :class="drpNs.e('editors-wrap')">
            <span :class="drpNs.e('time-picker-wrap')">
              <el-input
                size="small"
                :disabled="rangeState.selecting"
                :placeholder="t('el.datepicker.startDate')"
                :class="drpNs.e('editor')"
                :model-value="minVisibleDate"
                :validate-event="false"
                @input="(val) => handleDateInput(val, 'min')"
                @change="(val) => handleDateChange(val, 'min')"
              />
            </span>
            <span
              v-clickoutside="handleMinTimeClose"
              :class="drpNs.e('time-picker-wrap')"
            >
              <el-input
                size="small"
                :class="drpNs.e('editor')"
                :disabled="rangeState.selecting"
                :placeholder="t('el.datepicker.startTime')"
                :model-value="minVisibleTime"
                :validate-event="false"
                @focus="minTimePickerVisible = true"
                @input="(val) => handleTimeInput(val, 'min')"
                @change="(val) => handleTimeChange(val, 'min')"
              />
              <time-pick-panel
                :visible="minTimePickerVisible"
                :format="timeFormat"
                datetime-role="start"
                :parsed-value="leftDate"
                @pick="handleMinTimePick"
              />
            </span>
          </span>
          <span>
            <el-icon><arrow-right /></el-icon>
          </span>
          <span :class="drpNs.e('editors-wrap')" class="is-right">
            <span :class="drpNs.e('time-picker-wrap')">
              <el-input
                size="small"
                :class="drpNs.e('editor')"
                :disabled="rangeState.selecting"
                :placeholder="t('el.datepicker.endDate')"
                :model-value="maxVisibleDate"
                :readonly="!minDate"
                :validate-event="false"
                @input="(val) => handleDateInput(val, 'max')"
                @change="(val) => handleDateChange(val, 'max')"
              />
            </span>
            <span
              v-clickoutside="handleMaxTimeClose"
              :class="drpNs.e('time-picker-wrap')"
            >
              <el-input
                size="small"
                :class="drpNs.e('editor')"
                :disabled="rangeState.selecting"
                :placeholder="t('el.datepicker.endTime')"
                :model-value="maxVisibleTime"
                :readonly="!minDate"
                :validate-event="false"
                @focus="minDate && (maxTimePickerVisible = true)"
                @input="(val) => handleTimeInput(val, 'max')"
                @change="(val) => handleTimeChange(val, 'max')"
              />
              <time-pick-panel
                datetime-role="end"
                :visible="maxTimePickerVisible"
                :format="timeFormat"
                :parsed-value="rightDate"
                @pick="handleMaxTimePick"
              />
            </span>
          </span>
        </div>
        <div :class="[ppNs.e('content'), drpNs.e('content')]" class="is-left">
          <div :class="drpNs.e('header')">
            <el-button
              text
              :class="ppNs.e('icon-btn')"
              :aria-label="t(`el.datepicker.prevYear`)"
              class="d-arrow-left icon-button"
              @click="leftPrevYear"
            >
              <slot name="prev-year">
                <el-icon size="16px" color="#374957">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                  >
                    <path
                      d="M7.95949 4.47147L7.01683 3.52881L3.48816 7.05747C3.2382 7.30751 3.09778 7.64659 3.09778 8.00014C3.09778 8.35369 3.2382 8.69277 3.48816 8.94281L7.01683 12.4715L7.95949 11.5288L4.43349 8.00014L7.95949 4.47147Z"
                    />
                    <path
                      d="M12.6259 4.47147L11.6833 3.52881L7.68329 7.52881C7.55831 7.65383 7.4881 7.82337 7.4881 8.00014C7.4881 8.17692 7.55831 8.34646 7.68329 8.47147L11.6833 12.4715L12.6259 11.5288L9.09995 8.00014L12.6259 4.47147Z"
                    />
                  </svg>
                </el-icon>
              </slot>
            </el-button>
            <el-button
              text
              :class="ppNs.e('icon-btn')"
              :aria-label="t(`el.datepicker.prevMonth`)"
              class="arrow-left icon-button"
              @click="leftPrevMonth"
            >
              <slot name="prev-month">
                <el-icon size="16px" color="#374957">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                  >
                    <path
                      d="M9.68339 12.4715L6.15473 8.94281C5.90476 8.69277 5.76434 8.35369 5.76434 8.00014C5.76434 7.64659 5.90476 7.30751 6.15473 7.05747L9.68339 3.52881L10.6261 4.47147L7.10006 8.00014L10.6287 11.5288L9.68339 12.4715Z"
                    />
                  </svg>
                </el-icon>
              </slot>
            </el-button>
            <el-button
              v-if="unlinkPanels"
              text
              :disabled="!enableYearArrow"
              :class="[ppNs.e('icon-btn'), { 'is-disabled': !enableYearArrow }]"
              :aria-label="t(`el.datepicker.nextYear`)"
              class="d-arrow-right icon-button"
              @click="leftNextYear"
            >
              <slot name="next-year">
                <el-icon>
                  <d-arrow-right />
                </el-icon>
              </slot>
            </el-button>
            <el-button
              v-if="unlinkPanels && leftCurrentView === 'date'"
              text
              :disabled="!enableMonthArrow"
              :class="[
                ppNs.e('icon-btn'),
                { 'is-disabled': !enableMonthArrow },
              ]"
              :aria-label="t(`el.datepicker.nextMonth`)"
              class="arrow-right icon-button"
              @click="leftNextMonth"
            >
              <slot name="next-month">
                <el-icon>
                  <arrow-right />
                </el-icon>
              </slot>
            </el-button>
            <div>{{ leftLabel }}</div>
          </div>
          <date-table
            v-if="leftCurrentView === 'date'"
            ref="leftCurrentViewRef"
            selection-mode="range"
            :date="leftDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :cycle="cycle"
            :sett-default-date="settDefaultDate"
            :cycle-type="cycleType"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            :show-week-number="showWeekNumber"
            @changerange="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
          <year-table
            v-if="leftCurrentView === 'year'"
            ref="leftCurrentViewRef"
            selection-mode="year"
            :date="leftDate"
            :disabled-date="disabledDate"
            :parsed-value="parsedValue"
            @pick="handleLeftYearPick"
          />
          <month-table
            v-if="leftCurrentView === 'month'"
            ref="leftCurrentViewRef"
            selection-mode="month"
            :date="leftDate"
            :parsed-value="parsedValue"
            :disabled-date="disabledDate"
            @pick="handleLeftMonthPick"
          />
        </div>
        <div :class="[ppNs.e('content'), drpNs.e('content')]" class="is-right">
          <div :class="drpNs.e('header')">
            <el-button
              v-if="unlinkPanels"
              text
              :disabled="!enableYearArrow"
              :class="[ppNs.e('icon-btn'), { 'is-disabled': !enableYearArrow }]"
              :aria-label="t(`el.datepicker.prevYear`)"
              class="d-arrow-left icon-button"
              @click="rightPrevYear"
            >
              <slot name="prev-year">
                <el-icon>
                  <d-arrow-left />
                </el-icon>
              </slot>
            </el-button>
            <el-button
              v-if="unlinkPanels && rightCurrentView === 'date'"
              text
              :disabled="!enableMonthArrow"
              :class="[
                ppNs.e('icon-btn'),
                { 'is-disabled': !enableMonthArrow },
              ]"
              :aria-label="t(`el.datepicker.prevMonth`)"
              class="arrow-left icon-button"
              @click="rightPrevMonth"
            >
              <slot name="prev-month">
                <el-icon>
                  <arrow-left />
                </el-icon>
              </slot>
            </el-button>
            <el-button
              text
              :aria-label="t(`el.datepicker.nextYear`)"
              :class="ppNs.e('icon-btn')"
              class="d-arrow-right icon-button"
              @click="rightNextYear"
            >
              <slot name="next-year">
                <el-icon size="16px">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                  >
                    <path
                      d="M13.2334 7.05747L9.70742 3.52881L8.76675 4.47147L12.2927 8.00014L8.76675 11.5288L9.71009 12.4715L13.2334 8.94281C13.4834 8.69277 13.6238 8.35369 13.6238 8.00014C13.6238 7.64659 13.4834 7.30751 13.2334 7.05747Z"
                    />
                    <path
                      d="M9.04055 7.52881L5.04055 3.52881L4.09988 4.47147L7.62588 8.00014L4.09988 11.5288L5.04322 12.4715L9.04322 8.47147C9.16784 8.3461 9.23758 8.17637 9.23708 7.99959C9.23658 7.82281 9.16589 7.65347 9.04055 7.52881Z"
                    />
                  </svg>
                </el-icon>
              </slot>
            </el-button>
            <el-button
              text
              :class="ppNs.e('icon-btn')"
              :aria-label="t(`el.datepicker.nextMonth`)"
              class="arrow-right icon-button"
              @click="rightNextMonth"
            >
              <slot name="next-month">
                <el-icon size="16px" color="#374957">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                  >
                    <path
                      d="M7.70742 12.4715L6.76675 11.5288L10.2927 8.00014L6.76675 4.47147L7.71009 3.52881L11.2334 7.05747C11.4834 7.30751 11.6238 7.64659 11.6238 8.00014C11.6238 8.35369 11.4834 8.69277 11.2334 8.94281L7.70742 12.4715Z"
                    />
                  </svg>
                </el-icon>
              </slot>
            </el-button>
            <div>{{ rightLabel }}</div>
          </div>
          <date-table
            v-if="rightCurrentView === 'date'"
            ref="rightCurrentViewRef"
            selection-mode="range"
            :date="rightDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :cycle="cycle"
            :sett-default-date="settDefaultDate"
            :cycle-type="cycleType"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            :show-week-number="showWeekNumber"
            @changerange="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
          <year-table
            v-if="rightCurrentView === 'year'"
            ref="rightCurrentViewRef"
            selection-mode="year"
            :date="rightDate"
            :disabled-date="disabledDate"
            :parsed-value="parsedValue"
            @pick="handleRightYearPick"
          />
          <month-table
            v-if="rightCurrentView === 'month'"
            ref="rightCurrentViewRef"
            selection-mode="month"
            :date="rightDate"
            :parsed-value="parsedValue"
            :disabled-date="disabledDate"
            @pick="handleRightMonthPick"
          />
        </div>
      </div>
    </div>
    <div
      v-if="
        showFooter &&
        (showTime ||
          ['week', 'custom'].includes(cycleType) ||
          clearable ||
          isOk)
      "
      :class="ppNs.e('footer')"
    >
      <el-button
        v-if="clearable"
        :class="ppNs.e('link-btn')"
        @click="handleClear"
      >
        {{ t('el.datepicker.clear') }}
      </el-button>
      <el-button
        v-if="isOk"
        plain
        size="small"
        :class="ppNs.e('link-btn')"
        :disabled="btnDisabled"
        @click="handleRangeConfirm(false)"
      >
        {{ t('el.datepicker.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toRef, unref, useSlots, watch } from 'vue'
import { isArray } from '@element-plus/utils'
import dayjs from 'dayjs'
import { ClickOutside as vClickoutside } from '@element-plus/directives'
import { useLocale } from '@element-plus/hooks'
import ElButton from '@element-plus/components/button'
import ElInput from '@element-plus/components/input'
import {
  PICKER_BASE_INJECTION_KEY,
  TimePickPanel,
  extractDateFormat,
  extractTimeFormat,
} from '@element-plus/components/time-picker'
import ElIcon from '@element-plus/components/icon'
import {
  ArrowLeft,
  ArrowRight,
  DArrowLeft,
  DArrowRight,
} from '@element-plus/icons-vue'
import { panelDateRangeProps } from '../props/panel-date-range'
import { useRangePicker } from '../composables/use-range-picker'
import {
  correctlyParseUserInput,
  getDefaultValue,
  isValidRange,
} from '../utils'
import { usePanelDateRange } from '../composables/use-panel-date-range'
import { ROOT_PICKER_IS_DEFAULT_FORMAT_INJECTION_KEY } from '../constants'
import YearTable from './basic-year-table.vue'
import MonthTable from './basic-month-table.vue'
import DateTable from './basic-date-table.vue'

import type { Dayjs } from 'dayjs'

type ChangeType = 'min' | 'max'
type UserInput = {
  min: string | null
  max: string | null
}

const props = defineProps(panelDateRangeProps)
const emit = defineEmits([
  'pick',
  'set-picker-option',
  'calendar-change',
  'panel-change',
])

const unit = 'month'
// FIXME: fix the type for ep picker
const pickerBase = inject(PICKER_BASE_INJECTION_KEY) as any
const isDefaultFormat = inject(
  ROOT_PICKER_IS_DEFAULT_FORMAT_INJECTION_KEY
) as any
const { disabledDate, cellClassName, defaultTime, clearable, isOk } =
  pickerBase.props
const format = toRef(pickerBase.props, 'format')
const shortcuts = toRef(pickerBase.props, 'shortcuts')
const defaultValue = toRef(pickerBase.props, 'defaultValue')
const cycle = toRef(pickerBase.props, 'cycle')
const settDefaultDate = toRef(pickerBase.props, 'settDefaultDate')
const cycleType = toRef(pickerBase.props, 'cycleType')
const showFooter = toRef(pickerBase.props, 'showFooter')
const slots = useSlots()
const { lang } = useLocale()
const leftDate = ref<Dayjs>(dayjs().locale(lang.value))
const rightDate = ref<Dayjs>(dayjs().locale(lang.value).add(1, unit))

const {
  minDate,
  maxDate,
  rangeState,
  ppNs,
  drpNs,
  handleChangeRange,
  handleRangeConfirm,
  handleShortcutClick,
  onSelect,
  onReset,
  t,
} = useRangePicker(props, {
  defaultValue,
  defaultTime,
  leftDate,
  rightDate,
  unit,
  onParsedValueChanged,
})

watch(
  () => props.visible,
  (visible) => {
    if (!visible && rangeState.value.selecting) {
      onReset(props.parsedValue)
      onSelect(false)
    }
  }
)

const dateUserInput = ref<UserInput>({
  min: null,
  max: null,
})

const timeUserInput = ref<UserInput>({
  min: null,
  max: null,
})

const leftLabel = computed(() => {
  return `${t(
    `el.datepicker.month${leftDate.value.month() + 1}`
  )} ${leftDate.value.year()} ${t('el.datepicker.year')}`
})

const rightLabel = computed(() => {
  return `${t(
    `el.datepicker.month${rightDate.value.month() + 1}`
  )} ${rightDate.value.year()} ${t('el.datepicker.year')}`
})

const {
  leftCurrentView,
  rightCurrentView,
  leftCurrentViewRef,
  rightCurrentViewRef,
  leftYear,
  rightYear,
  leftMonth,
  rightMonth,
  // leftYearLabel,
  // rightYearLabel,
  // showLeftPicker,
  // showRightPicker,
  handleLeftYearPick,
  handleRightYearPick,
  handleLeftMonthPick,
  handleRightMonthPick,
  handlePanelChange,
  adjustDateByView,
} = usePanelDateRange(props, emit, leftDate, rightDate)

const hasShortcuts = computed(() => !!shortcuts.value.length)

const minVisibleDate = computed(() => {
  if (dateUserInput.value.min !== null) return dateUserInput.value.min
  if (minDate.value) return minDate.value.format(dateFormat.value)
  return ''
})

const maxVisibleDate = computed(() => {
  if (dateUserInput.value.max !== null) return dateUserInput.value.max
  if (maxDate.value || minDate.value)
    return (maxDate.value || minDate.value)!.format(dateFormat.value)
  return ''
})

const minVisibleTime = computed(() => {
  if (timeUserInput.value.min !== null) return timeUserInput.value.min
  if (minDate.value) return minDate.value.format(timeFormat.value)
  return ''
})

const maxVisibleTime = computed(() => {
  if (timeUserInput.value.max !== null) return timeUserInput.value.max
  if (maxDate.value || minDate.value)
    return (maxDate.value || minDate.value)!.format(timeFormat.value)
  return ''
})

const timeFormat = computed(() => {
  return props.timeFormat || extractTimeFormat(format.value)
})

const dateFormat = computed(() => {
  return props.dateFormat || extractDateFormat(format.value)
})

const isValidValue = (date: [Dayjs, Dayjs]) => {
  return (
    isValidRange(date) &&
    (disabledDate
      ? !disabledDate(date[0].toDate()) && !disabledDate(date[1].toDate())
      : true)
  )
}

const leftPrevYear = () => {
  leftDate.value = adjustDateByView(
    leftCurrentView.value,
    leftDate.value,
    false
  )

  if (!props.unlinkPanels) {
    rightDate.value = leftDate.value.add(1, 'month')
  }
  handlePanelChange('year')
}

const leftPrevMonth = () => {
  leftDate.value = leftDate.value.subtract(1, 'month')
  if (!props.unlinkPanels) {
    rightDate.value = leftDate.value.add(1, 'month')
  }
  handlePanelChange('month')
}

const rightNextYear = () => {
  if (!props.unlinkPanels) {
    leftDate.value = adjustDateByView(
      rightCurrentView.value,
      leftDate.value,
      true
    )

    rightDate.value = leftDate.value.add(1, 'month')
  } else {
    rightDate.value = adjustDateByView(
      rightCurrentView.value,
      rightDate.value,
      true
    )
  }
  handlePanelChange('year')
}

const rightNextMonth = () => {
  if (!props.unlinkPanels) {
    leftDate.value = leftDate.value.add(1, 'month')
    rightDate.value = leftDate.value.add(1, 'month')
  } else {
    rightDate.value = rightDate.value.add(1, 'month')
  }
  handlePanelChange('month')
}

const leftNextYear = () => {
  leftDate.value = adjustDateByView(leftCurrentView.value, leftDate.value, true)

  handlePanelChange('year')
}

const leftNextMonth = () => {
  leftDate.value = leftDate.value.add(1, 'month')
  handlePanelChange('month')
}

const rightPrevYear = () => {
  rightDate.value = adjustDateByView(
    rightCurrentView.value,
    rightDate.value,
    false
  )

  handlePanelChange('year')
}

const rightPrevMonth = () => {
  rightDate.value = rightDate.value.subtract(1, 'month')
  handlePanelChange('month')
}

const enableMonthArrow = computed(() => {
  const nextMonth = (leftMonth.value + 1) % 12
  const yearOffset = leftMonth.value + 1 >= 12 ? 1 : 0
  return (
    props.unlinkPanels &&
    new Date(leftYear.value + yearOffset, nextMonth) <
      new Date(rightYear.value, rightMonth.value)
  )
})

const enableYearArrow = computed(() => {
  return (
    props.unlinkPanels &&
    rightYear.value * 12 +
      rightMonth.value -
      (leftYear.value * 12 + leftMonth.value + 1) >=
      12
  )
})

const btnDisabled = computed(() => {
  return !(
    minDate.value &&
    maxDate.value &&
    !rangeState.value.selecting &&
    isValidRange([minDate.value, maxDate.value])
  )
})

const showTime = computed(
  () => props.type === 'datetime' || props.type === 'datetimerange'
)

const formatEmit = (emitDayjs: Dayjs | null, index?: number) => {
  if (!emitDayjs) return
  if (defaultTime) {
    const defaultTimeD = dayjs(
      defaultTime[index as number] || defaultTime
    ).locale(lang.value)
    return defaultTimeD
      .year(emitDayjs.year())
      .month(emitDayjs.month())
      .date(emitDayjs.date())
  }
  return emitDayjs
}
const getSelectingDate: any = inject('getSelectingDate', {
  getSelectingDate: undefined,
})
const handleRangePick = (
  val: {
    minDate: Dayjs
    maxDate: Dayjs | null
  },
  close = true
) => {
  const min_ = val.minDate
  const max_ = val.maxDate
  const minDate_ = formatEmit(min_, 0)
  const maxDate_ = formatEmit(max_, 1)
  if (typeof getSelectingDate.getSelectingDate === 'function') {
    getSelectingDate.getSelectingDate(val)
  }
  if (maxDate.value === maxDate_ && minDate.value === minDate_) {
    return
  }
  emit('calendar-change', [min_.toDate(), max_ && max_.toDate()])
  maxDate.value = maxDate_
  minDate.value = minDate_
  if (!close || showTime.value || slots.option?.()) return
  handleRangeConfirm()
}

const minTimePickerVisible = ref(false)
const maxTimePickerVisible = ref(false)

const handleMinTimeClose = () => {
  minTimePickerVisible.value = false
}

const handleMaxTimeClose = () => {
  maxTimePickerVisible.value = false
}

const handleDateInput = (value: string | null, type: ChangeType) => {
  dateUserInput.value[type] = value
  const parsedValueD = dayjs(value, dateFormat.value).locale(lang.value)
  if (parsedValueD.isValid()) {
    if (disabledDate && disabledDate(parsedValueD.toDate())) {
      return
    }
    if (type === 'min') {
      leftDate.value = parsedValueD
      minDate.value = (minDate.value || leftDate.value)
        .year(parsedValueD.year())
        .month(parsedValueD.month())
        .date(parsedValueD.date())
      if (
        !props.unlinkPanels &&
        (!maxDate.value || maxDate.value.isBefore(minDate.value))
      ) {
        rightDate.value = parsedValueD.add(1, 'month')
        maxDate.value = minDate.value.add(1, 'month')
      }
    } else {
      rightDate.value = parsedValueD
      maxDate.value = (maxDate.value || rightDate.value)
        .year(parsedValueD.year())
        .month(parsedValueD.month())
        .date(parsedValueD.date())
      if (
        !props.unlinkPanels &&
        (!minDate.value || minDate.value.isAfter(maxDate.value))
      ) {
        leftDate.value = parsedValueD.subtract(1, 'month')
        minDate.value = maxDate.value.subtract(1, 'month')
      }
    }
  }
}

const handleDateChange = (_: unknown, type: ChangeType) => {
  dateUserInput.value[type] = null
}

const handleTimeInput = (value: string | null, type: ChangeType) => {
  timeUserInput.value[type] = value
  const parsedValueD = dayjs(value, timeFormat.value).locale(lang.value)

  if (parsedValueD.isValid()) {
    if (type === 'min') {
      minTimePickerVisible.value = true
      minDate.value = (minDate.value || leftDate.value)
        .hour(parsedValueD.hour())
        .minute(parsedValueD.minute())
        .second(parsedValueD.second())
      leftDate.value = minDate.value
    } else {
      maxTimePickerVisible.value = true
      maxDate.value = (maxDate.value || rightDate.value)
        .hour(parsedValueD.hour())
        .minute(parsedValueD.minute())
        .second(parsedValueD.second())
      rightDate.value = maxDate.value
    }
  }
}

const handleTimeChange = (_value: string | null, type: ChangeType) => {
  timeUserInput.value[type] = null
  if (type === 'min') {
    leftDate.value = minDate.value!
    minTimePickerVisible.value = false
    if (!maxDate.value || maxDate.value.isBefore(minDate.value)) {
      maxDate.value = minDate.value
    }
  } else {
    rightDate.value = maxDate.value!
    maxTimePickerVisible.value = false
    if (maxDate.value && maxDate.value.isBefore(minDate.value)) {
      minDate.value = maxDate.value
    }
  }
  handleRangeConfirm(true)
}

const handleMinTimePick = (value: Dayjs, visible: boolean, first: boolean) => {
  if (timeUserInput.value.min) return
  if (value) {
    leftDate.value = value
    minDate.value = (minDate.value || leftDate.value)
      .hour(value.hour())
      .minute(value.minute())
      .second(value.second())
  }

  if (!first) {
    minTimePickerVisible.value = visible
  }

  if (!maxDate.value || maxDate.value.isBefore(minDate.value)) {
    maxDate.value = minDate.value
    rightDate.value = value
  }
  handleRangeConfirm(true)
}

const handleMaxTimePick = (
  value: Dayjs | null,
  visible: boolean,
  first: boolean
) => {
  if (timeUserInput.value.max) return
  if (value) {
    rightDate.value = value
    maxDate.value = (maxDate.value || rightDate.value)
      .hour(value.hour())
      .minute(value.minute())
      .second(value.second())
  }

  if (!first) {
    maxTimePickerVisible.value = visible
  }

  if (maxDate.value && maxDate.value.isBefore(minDate.value)) {
    minDate.value = maxDate.value
  }
  handleRangeConfirm(true)
}

const handleClear = () => {
  let valueOnClear = null
  if (pickerBase?.emptyValues) {
    valueOnClear = pickerBase.emptyValues.valueOnClear.value
  }
  leftDate.value = getDefaultValue(unref(defaultValue), {
    lang: unref(lang),
    unit: 'month',
    unlinkPanels: props.unlinkPanels,
  })[0]
  rightDate.value = leftDate.value.add(1, 'month')
  maxDate.value = undefined
  minDate.value = undefined

  handleRangeConfirm(true)
  emit('pick', valueOnClear)
}

const formatToString = (value: Dayjs | Dayjs[]) => {
  return isArray(value)
    ? value.map((_) => _.format(format.value))
    : value.format(format.value)
}

const parseUserInput = (value: Dayjs | Dayjs[]) => {
  return correctlyParseUserInput(
    value,
    format.value,
    lang.value,
    isDefaultFormat
  )
}

function onParsedValueChanged(
  minDate: Dayjs | undefined,
  maxDate: Dayjs | undefined
) {
  const today = dayjs().locale(lang.value)
  const includesToday =
    minDate &&
    maxDate &&
    !today.isBefore(minDate, 'day') &&
    !today.isAfter(maxDate, 'day')

  if (includesToday) {
    leftDate.value = today
    if (props.unlinkPanels && maxDate) {
      const currentYear = today.year()
      const currentMonth = today.month()
      rightDate.value =
        currentYear === maxDate.year() && currentMonth === maxDate.month()
          ? maxDate.add(1, unit)
          : maxDate
    } else {
      rightDate.value = leftDate.value.add(1, unit)
      if (maxDate) {
        rightDate.value = rightDate.value
          .hour(maxDate.hour())
          .minute(maxDate.minute())
          .second(maxDate.second())
      }
    }
    return
  }

  if (props.unlinkPanels && maxDate) {
    const minDateYear = minDate?.year() || 0
    const minDateMonth = minDate?.month() || 0
    const maxDateYear = maxDate.year()
    const maxDateMonth = maxDate.month()
    rightDate.value =
      minDateYear === maxDateYear && minDateMonth === maxDateMonth
        ? maxDate.add(1, unit)
        : maxDate
  } else {
    rightDate.value = leftDate.value.add(1, unit)
    if (maxDate) {
      rightDate.value = rightDate.value
        .hour(maxDate.hour())
        .minute(maxDate.minute())
        .second(maxDate.second())
    }
  }
}

emit('set-picker-option', ['isValidValue', isValidValue])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['handleClear', handleClear])
emit('set-picker-option', [
  'handleClosePick',
  () => {
    if (isValidRange([minDate.value, maxDate.value])) {
      handleRangeConfirm(false)
    }
  },
])
emit('set-picker-option', ['formatToString', formatToString])
</script>
