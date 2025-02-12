import type { ComponentPublicInstance, Ref } from 'vue'
import type { DatePickerProps, SelectType } from './props/date-picker'

export type DatePickerExpose = {
  selectType: Ref<SelectType | undefined>
  focus: () => void
  blur: () => void
  handleOpen: () => void
  handleClose: () => void
}
export type DatePickerInstance = ComponentPublicInstance<
  DatePickerProps,
  DatePickerExpose
>
