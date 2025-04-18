import { timePickerDefaultProps } from '@element-plus/components/time-picker'
import { buildProps, definePropType } from '@element-plus/utils'

import type { ExtractPropTypes } from 'vue'
import type { IDatePickerType } from '../date-picker.type'

export type SelectTypeKey = 'date' | 'month' | 'year'
export type SelectType = { key: SelectTypeKey; label: string }

export const datePickerProps = buildProps({
  ...timePickerDefaultProps,
  /**
   * @description type of the picker
   */
  type: {
    type: definePropType<IDatePickerType>(String),
    default: 'date',
  },
  typeList: {
    type: Array<SelectType>,
    default: () => [],
  },
} as const)

export type DatePickerProps = ExtractPropTypes<typeof datePickerProps>
