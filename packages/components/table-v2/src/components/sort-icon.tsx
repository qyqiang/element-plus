import ElIcon from '@element-plus/components/icon'
import FilterIconUp from './filter-icon-up.vue'
import FilterIconDown from './filter-icon-down.vue'
import { SortOrder } from '../constants'

import type { FunctionalComponent } from 'vue'

export type SortIconProps = {
  sortOrder: SortOrder
  sorting?: boolean
  class?: JSX.IntrinsicAttributes['class']
}

const SortIcon: FunctionalComponent<SortIconProps> = (props) => {
  const { sortOrder, sorting } = props
  return (
    <ElIcon
      size={12}
      class={props.class}
      color={sorting ? '#ff5b05' : '#9FB1BD'}
    >
      {sortOrder === SortOrder.ASC ? <FilterIconUp /> : <FilterIconDown />}
    </ElIcon>
  )
}

export default SortIcon
