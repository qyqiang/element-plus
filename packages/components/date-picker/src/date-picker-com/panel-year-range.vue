<template>
  <div :class="panelKls">
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
      <div :class="ppNs.e('body')">
        <div :class="leftPanelKls.content">
          <div :class="drpNs.e('header')">
            <el-button
              text
              class="icon-button"
              :class="leftPanelKls.arrowLeftBtn"
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
              v-if="unlinkPanels"
              text
              class="icon-button"
              :disabled="!enableYearArrow"
              :class="leftPanelKls.arrowRightBtn"
              @click="leftNextYear"
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
            <div>{{ leftLabel }}</div>
          </div>
          <year-table
            selection-mode="range"
            :date="leftDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @changerange="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
        <div :class="rightPanelKls.content">
          <div :class="drpNs.e('header')">
            <el-button
              v-if="unlinkPanels"
              text
              class="icon-button"
              :disabled="!enableYearArrow"
              :class="rightPanelKls.arrowLeftBtn"
              @click="rightPrevYear"
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
              class="icon-button"
              :class="rightPanelKls.arrowRightBtn"
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
            <div>{{ rightLabel }}</div>
          </div>
          <year-table
            selection-mode="range"
            :date="rightDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @changerange="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toRef, unref, useSlots, watch } from 'vue'
import dayjs from 'dayjs'
import ElButton from '@element-plus/components/button/src/button.vue'
import { isArray } from '@element-plus/utils'
import ElIcon from '@element-plus/components/icon'
import { useLocale } from '@element-plus/hooks'
import { PICKER_BASE_INJECTION_KEY } from '@element-plus/components/time-picker'
import {
  panelYearRangeEmits,
  panelYearRangeProps,
} from '../props/panel-year-range'
import { useYearRangeHeader } from '../composables/use-year-range-header'
import { useRangePicker } from '../composables/use-range-picker'
import {
  correctlyParseUserInput,
  getDefaultValue,
  isValidRange,
} from '../utils'
import { ROOT_PICKER_IS_DEFAULT_FORMAT_INJECTION_KEY } from '../constants'
import YearTable from './basic-year-table.vue'

import type { Dayjs } from 'dayjs'

defineOptions({
  name: 'DatePickerYearRange',
})

const props = defineProps(panelYearRangeProps)
const emit = defineEmits(panelYearRangeEmits)
const step = 10
const unit = 'year'

const { lang } = useLocale()
const leftDate = ref(dayjs().locale(lang.value))
const rightDate = ref(dayjs().locale(lang.value).add(step, unit))
const isDefaultFormat = inject(
  ROOT_PICKER_IS_DEFAULT_FORMAT_INJECTION_KEY
) as any
const pickerBase = inject(PICKER_BASE_INJECTION_KEY) as any
const { shortcuts, disabledDate } = pickerBase.props
const format = toRef(pickerBase.props, 'format')
const defaultValue = toRef(pickerBase.props, 'defaultValue')

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
} = useRangePicker(props, {
  defaultValue,
  leftDate,
  rightDate,
  step,
  unit,
  onParsedValueChanged,
})

const {
  leftPrevYear,
  rightNextYear,
  leftNextYear,
  rightPrevYear,
  leftLabel,
  rightLabel,
  leftYear,
  rightYear,
} = useYearRangeHeader({
  unlinkPanels: toRef(props, 'unlinkPanels'),
  leftDate,
  rightDate,
})

const hasShortcuts = computed(() => !!shortcuts.length)

const panelKls = computed(() => [
  ppNs.b(),
  drpNs.b(),
  {
    'has-sidebar': Boolean(useSlots().sidebar) || hasShortcuts.value,
  },
])

const leftPanelKls = computed(() => {
  return {
    content: [ppNs.e('content'), drpNs.e('content'), 'is-left'],
    arrowLeftBtn: [ppNs.e('icon-btn'), 'd-arrow-left'],
    arrowRightBtn: [
      ppNs.e('icon-btn'),
      ppNs.is('disabled', !enableYearArrow.value),
      'd-arrow-right',
    ],
  }
})

const rightPanelKls = computed(() => {
  return {
    content: [ppNs.e('content'), drpNs.e('content'), 'is-right'],
    arrowLeftBtn: [
      ppNs.e('icon-btn'),
      ppNs.is('disabled', !enableYearArrow.value),
      'd-arrow-left',
    ],
    arrowRightBtn: [ppNs.e('icon-btn'), 'd-arrow-right'],
  }
})

const enableYearArrow = computed(() => {
  return props.unlinkPanels && rightYear.value > leftYear.value + 1
})

type RangePickValue = {
  minDate: Dayjs
  maxDate: Dayjs
}
const handleRangePick = (val: RangePickValue, close = true) => {
  const minDate_ = val.minDate
  const maxDate_ = val.maxDate
  if (maxDate.value === maxDate_ && minDate.value === minDate_) {
    return
  }
  emit('calendar-change', [minDate_.toDate(), maxDate_ && maxDate_.toDate()])
  maxDate.value = maxDate_
  minDate.value = minDate_

  if (!close) return
  handleRangeConfirm()
}

const parseUserInput = (value: Dayjs | Dayjs[]) => {
  return correctlyParseUserInput(
    value,
    format.value,
    lang.value,
    isDefaultFormat
  )
}

const isValidValue = (date: [Dayjs, Dayjs]) => {
  return (
    isValidRange(date) &&
    (disabledDate
      ? !disabledDate(date[0].toDate()) && !disabledDate(date[1].toDate())
      : true)
  )
}

const handleClear = () => {
  let valueOnClear = null
  if (pickerBase?.emptyValues) {
    valueOnClear = pickerBase.emptyValues.valueOnClear.value
  }
  const defaultArr = getDefaultValue(unref(defaultValue), {
    lang: unref(lang),
    step,
    unit,
    unlinkPanels: props.unlinkPanels,
  })
  leftDate.value = defaultArr[0]
  rightDate.value = defaultArr[1]
  emit('pick', valueOnClear)
}

function onParsedValueChanged(
  minDate: Dayjs | undefined,
  maxDate: Dayjs | undefined
) {
  if (props.unlinkPanels && maxDate) {
    const minDateYear = minDate?.year() || 0
    const maxDateYear = maxDate.year()

    rightDate.value =
      minDateYear + step > maxDateYear ? maxDate.add(step, unit) : maxDate
  } else {
    rightDate.value = leftDate.value.add(step, unit)
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (!visible && rangeState.value.selecting) {
      onReset(props.parsedValue)
      onSelect(false)
    }
  }
)

emit('set-picker-option', ['isValidValue', isValidValue])
emit('set-picker-option', ['parseUserInput', parseUserInput])
emit('set-picker-option', ['handleClear', handleClear])
</script>
