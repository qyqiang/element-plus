import { computed } from 'vue'
import { get } from 'lodash-unified'

import type { SelectV2Props } from './token'
import type { Option } from './select.types'

export interface Props {
  label?: string
  value?: string
  disabled?: string
  options?: string
  tip?: string
}

export const defaultProps: Required<Props> = {
  label: 'label',
  value: 'value',
  disabled: 'disabled',
  options: 'options',
  tip: 'tip',
}

export function useProps(props: Pick<SelectV2Props, 'props'>) {
  const aliasProps = computed(() => ({ ...defaultProps, ...props.props }))

  const getLabel = (option: Option) => get(option, aliasProps.value.label)
  const getValue = (option: Option) => get(option, aliasProps.value.value)
  const getDisabled = (option: Option) => get(option, aliasProps.value.disabled)
  const getOptions = (option: Option) => get(option, aliasProps.value.options)
  const getTip = (option: Option) => get(option, aliasProps.value.tip)

  return {
    aliasProps,
    getLabel,
    getValue,
    getDisabled,
    getOptions,
    getTip,
  }
}
