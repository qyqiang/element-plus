import { buildProps, definePropType } from '@element-plus/utils'
import { column } from './common'

import type {
  ExtractPropTypes,
  StyleValue,
  __ExtractPublicPropTypes,
} from 'vue'
import type { TableV2OverflowTooltipOptions } from './types'

export const tableV2CellProps = buildProps({
  class: String,
  cellData: {
    type: definePropType<any>([String, Boolean, Number, Object]),
  },
  column,
  columnIndex: Number,
  style: {
    type: definePropType<StyleValue>([String, Array, Object]),
  },
  rowData: {
    type: definePropType<any>(Object),
  },
  rowIndex: Number,
  showOverflowTooltip: {
    type: definePropType<boolean | TableV2OverflowTooltipOptions>([
      Boolean,
      Object,
    ]),
    default: false,
  },
} as const)

export type TableV2CellProps = ExtractPropTypes<typeof tableV2CellProps>
export type TableV2CellPropsPublic = __ExtractPublicPropTypes<
  typeof tableV2CellProps
>
