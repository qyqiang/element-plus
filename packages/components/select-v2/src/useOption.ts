import type { OptionV2EmitFn, OptionV2Props } from './defaults'

export function useOption(
  props: OptionV2Props,
  { emit }: { emit: OptionV2EmitFn }
) {
  return {
    hoverItem: () => {
      emit('hover', props.disabled ? -1 : props.index)
    },
    selectOptionClick: () => {
      if (!props.disabled) {
        emit('select', props.item, props.index)
      }
    },
  }
}
