<template>
  <div class="data-end-range" :class="[ppNs.b(), drpNs.b()]">
    <div :class="ppNs.e('body-wrapper')">
      <slot name="option"></slot>
      <div :class="ppNs.e('body')">
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
            selection-mode="date"
            :date="leftDate"
            :parsed-value="displayedDate"
            :min-date="displayMinDate"
            :max-date="displayMaxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            :show-week-number="showWeekNumber"
            @changerange="handleChangeRange"
            @pick="handleDatePick"
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
            selection-mode="date"
            :date="rightDate"
            :parsed-value="displayedDate"
            :min-date="displayMinDate"
            :max-date="displayMaxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            :show-week-number="showWeekNumber"
            @changerange="handleChangeRange"
            @pick="handleDatePick"
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
    <div v-if="showFooter && (clearable || isOk)" :class="ppNs.e('footer')">
      <el-button
        v-if="clearable"
        :class="ppNs.e('link-btn')"
        @click="handleClear"
      >
        {{ t('el.datepicker.clear') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toRef, unref, watch } from 'vue'
import { isArray } from '@element-plus/utils'
import dayjs from 'dayjs'
import { useLocale } from '@element-plus/hooks'
import ElButton from '@element-plus/components/button'
import { PICKER_BASE_INJECTION_KEY } from '@element-plus/components/time-picker'
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
  getPartialRangePayload,
  isValidPartialRange,
} from '../utils'
import { usePanelDateRange } from '../composables/use-panel-date-range'
import { ROOT_PICKER_IS_DEFAULT_FORMAT_INJECTION_KEY } from '../constants'
import YearTable from './basic-year-table.vue'
import MonthTable from './basic-month-table.vue'
import DateTable from './basic-date-table.vue'

import type { Dayjs } from 'dayjs'

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
const {
  disabledDate: baseDisabledDate,
  cellClassName,
  defaultTime,
  clearable,
  isOk,
} = pickerBase.props
const format = toRef(pickerBase.props, 'format')
const defaultValue = toRef(pickerBase.props, 'defaultValue')
const showFooter = toRef(pickerBase.props, 'showFooter')
const { lang } = useLocale()
const leftDate = ref<Dayjs>(dayjs().locale(lang.value))
const rightDate = ref<Dayjs>(dayjs().locale(lang.value).add(1, unit))

const { minDate, maxDate, rangeState, ppNs, drpNs, t, handleChangeRange } =
  useRangePicker(props, {
    defaultValue,
    defaultTime,
    leftDate,
    rightDate,
    unit,
    onParsedValueChanged,
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

const displayedDate = computed(() => maxDate.value ?? minDate.value)
const displayMinDate = computed(() => {
  if (rangeState.value.selecting && minDate.value && rangeState.value.endDate) {
    return minDate.value
  }

  return minDate.value && maxDate.value ? minDate.value : undefined
})
const displayMaxDate = computed(() => {
  if (rangeState.value.selecting && minDate.value && rangeState.value.endDate) {
    return rangeState.value.endDate
  }

  return minDate.value && maxDate.value ? maxDate.value : undefined
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
  handleLeftYearPick,
  handleRightYearPick,
  handleLeftMonthPick,
  handleRightMonthPick,
  handlePanelChange,
  adjustDateByView,
} = usePanelDateRange(props, emit, leftDate, rightDate)

const isValidValue = (date: Array<Dayjs | null>) => {
  return isValidPartialRange(date, baseDisabledDate)
}

const disabledDate = (date: Date) => {
  if (baseDisabledDate?.(date)) return true

  return !!minDate.value && dayjs(date).isBefore(minDate.value, 'day')
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
const emitEndRange = (visible = false) => {
  emit(
    'pick',
    getPartialRangePayload([minDate.value, maxDate.value]).pickRange,
    visible
  )
}

const updateRangeValue = (
  nextMinDate: Dayjs | undefined,
  nextMaxDate: Dayjs | undefined,
  keepOpen = false
) => {
  const { dayRange, dateRange } = getPartialRangePayload([
    nextMinDate,
    nextMaxDate,
  ])
  const [normalizedMinDate, normalizedMaxDate] = dayRange

  minDate.value = normalizedMinDate
  maxDate.value = normalizedMaxDate
  rightDate.value = normalizedMaxDate || rightDate.value
  onParsedValueChanged(normalizedMinDate, normalizedMaxDate)
  emit('calendar-change', dateRange)

  if (!keepOpen) {
    emitEndRange(false)
  }
}

const handleDatePick = (value: Dayjs, keepOpen = false) => {
  const nextMaxDate = formatEmit(value, 1)
  if (!nextMaxDate) return

  updateRangeValue(minDate.value, nextMaxDate, keepOpen)
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

  emit('pick', valueOnClear)
}

const formatToString = (value: Dayjs | Array<Dayjs | null>) => {
  return isArray(value)
    ? value.map((_) => (_ ? _.format(format.value) : ''))
    : value.format(format.value)
}

const parseUserInput = (value: string | string[]) => {
  if (isArray(value)) {
    return value.map((item) =>
      item
        ? (correctlyParseUserInput(
            item,
            format.value,
            lang.value,
            isDefaultFormat
          ) as Dayjs)
        : null
    )
  }

  return correctlyParseUserInput(
    value,
    format.value,
    lang.value,
    isDefaultFormat
  )
}

const syncHoverRangeState = () => {
  if (!props.visible || !minDate.value) {
    rangeState.value.selecting = false
    rangeState.value.endDate = null
    return
  }

  rangeState.value.selecting = true
  rangeState.value.endDate = maxDate.value ?? null
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

watch(() => props.visible, syncHoverRangeState, { immediate: true })
watch([minDate, maxDate], syncHoverRangeState)

emit('set-picker-option', ['isValidValue', isValidValue])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['handleClear', handleClear])
emit('set-picker-option', [
  'handleClosePick',
  () => {
    if (minDate.value || maxDate.value) {
      emitEndRange(false)
    }
  },
])
emit('set-picker-option', ['formatToString', formatToString])
</script>
