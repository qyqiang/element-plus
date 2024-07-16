import {
  CircleCheck,
  CircleCloseFilled,
  Close,
  InfoFilled,
  Loading,
  SuccessFilled,
  WarningFilled,
} from '@element-plus/icons-vue'
import Warning from '../../icon/warning.vue'
import Check from '../../icon/check.vue'
import Error from '../../icon/error.vue'
import Info from '../../icon/info.vue'
import { definePropType } from './props'
import type { Component } from 'vue'

export const iconPropType = definePropType<string | Component>([
  String,
  Object,
  Function,
])

export const CloseComponents = {
  Close,
}

export const TypeComponents = {
  Close,
  SuccessFilled,
  InfoFilled,
  WarningFilled,
  CircleCloseFilled,
}

export const TypeComponentsMap = {
  success: Check,
  warning: Warning,
  error: Error,
  info: Info,
}

export const ValidateComponentsMap = {
  validating: Loading,
  success: CircleCheck,
  error: Warning,
}
