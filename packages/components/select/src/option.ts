import { buildProps, definePropType } from '@element-plus/utils'
import { placements } from '@popperjs/core'

import type { Placement } from '@element-plus/components/popper'

export const COMPONENT_NAME = 'ElOption'
export const optionProps = buildProps({
  /**
   * @description value of option
   */
  value: {
    type: [String, Number, Boolean, Object],
    required: true as const,
  },
  /**
   * @description label of option, same as `value` if omitted
   */
  label: {
    type: [String, Number],
  },
  created: Boolean,
  showTip: {
    type: Boolean,
    default: true,
  },
  /**
   * @description supplementary tooltip content for the option
   */
  tip: String,
  placement: {
    type: definePropType<Placement>(String),
    values: placements,
    default: 'left',
  },
  /**
   * @description whether option is disabled
   */
  disabled: Boolean,
  /**
   * @description raw option data used by label slot and other custom rendering
   */
  rawOption: {
    type: definePropType<Record<string, any>>(Object),
  },
})
