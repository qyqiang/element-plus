import type DatePicker from './date-picker'
import type { ComponentPublicInstance, Ref } from 'vue'
import type { DatePickerProps, SelectTypeKey } from './props/date-picker'

export type DatePickerInstance = InstanceType<typeof DatePicker> &
  DatePickerExpose

export type DatePickerExpose = {
  selectType: Ref<SelectTypeKey | undefined>
  focus: () => void
  blur: () => void
  handleOpen: () => void
  handleClose: () => void
}
export type DatePickerInstance = ComponentPublicInstance<
  DatePickerProps,
  DatePickerExpose
>
