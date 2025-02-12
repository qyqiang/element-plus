import { computed, defineComponent, provide, reactive, ref, toRef } from 'vue'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import localeData from 'dayjs/plugin/localeData.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import weekYear from 'dayjs/plugin/weekYear.js'
import dayOfYear from 'dayjs/plugin/dayOfYear.js'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js'
import { ElRadioButton, ElRadioGroup } from '@element-plus/components/radio'
import { useNamespace } from '@element-plus/hooks'
import {
  CommonPicker,
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_DATEPICKER,
  type DateModelType,
  type SingleOrRange,
} from '@element-plus/components/time-picker'
import { ROOT_PICKER_INJECTION_KEY } from './constants'

import { SelectType, datePickerProps } from './props/date-picker'
import { getPanel } from './panel-utils'
import type { DatePickerExpose } from './instance'

dayjs.extend(localeData)
dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs.extend(dayOfYear)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

export default defineComponent({
  name: 'ElDatePicker',
  install: null,
  props: datePickerProps,
  emits: ['update:modelValue'],
  setup(props, { expose, emit, slots }) {
    const ns = useNamespace('picker-panel')

    provide('ElPopperOptions', reactive(toRef(props, 'popperOptions')))
    provide(ROOT_PICKER_INJECTION_KEY, {
      slots,
      pickerNs: ns,
    })

    const selectType = ref<SelectType | undefined>(props.typeList?.[0])

    const handleRadioChange = (value: any) => {
      selectType.value = value
    }
    const commonPicker = ref<InstanceType<typeof CommonPicker>>()
    const refProps: DatePickerExpose = {
      selectType,
      focus: () => {
        commonPicker.value?.focus()
      },
      blur: () => {
        commonPicker.value?.blur()
      },
      handleOpen: () => {
        commonPicker.value?.handleOpen()
      },
      handleClose: () => {
        commonPicker.value?.handleClose()
      },
    }

    expose(refProps)

    const onModelValueUpdated = (val: SingleOrRange<DateModelType> | null) => {
      emit('update:modelValue', val)
    }

    const componentType = computed(() => {
      return selectType.value || props.type
    })

    return () => {
      // since props always have all defined keys on it, {format, ...props} will always overwrite format
      // pick props.format or provide default value here before spreading
      const format =
        props.format ??
        (DEFAULT_FORMATS_DATEPICKER[componentType.value] ||
          DEFAULT_FORMATS_DATE)

      const Component = getPanel(componentType.value)

      return (
        <CommonPicker
          {...props}
          format={format}
          type={componentType.value}
          ref={commonPicker}
          onUpdate:modelValue={onModelValueUpdated}
        >
          {{
            default: (scopedProps: /**FIXME: remove any type */ any) => (
              <>
                {props.typeList?.length > 0 && (
                  <ElRadioGroup
                    modelValue={selectType.value}
                    onChange={handleRadioChange}
                    size="small"
                  >
                    {props.typeList.map((type) => (
                      <ElRadioButton
                        key={type}
                        value={type}
                        label={type}
                        class={{ 'is-active': selectType.value === type }}
                      />
                    ))}
                  </ElRadioGroup>
                )}
                <Component {...scopedProps}>
                  {{
                    'prev-month': slots['prev-month'],
                    'next-month': slots['next-month'],
                    'prev-year': slots['prev-year'],
                    'next-year': slots['next-year'],
                  }}
                </Component>
              </>
            ),
            'range-separator': slots['range-separator'],
            open: slots['open'],
          }}
        </CommonPicker>
      )
    }
  },
})
