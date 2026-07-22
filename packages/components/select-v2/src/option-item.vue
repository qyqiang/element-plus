<template>
  <li
    :id="`${contentId}-${index}`"
    role="option"
    :aria-selected="selected"
    :aria-disabled="disabled || undefined"
    :style="optionStyle"
    :class="[
      ns.be('dropdown', 'item'),
      ns.is('selected', selected),
      ns.is('disabled', disabled),
      ns.is('created', created),
      ns.is('hovering', hovering),
    ]"
    @mousemove="hoverItem"
    @click.stop="selectOptionClick"
    @mouseenter="handleCellMouseEnter"
  >
    <slot :item="item" :index="index" :disabled="disabled">
      <div class="option-wrap">
        <el-checkbox
          v-if="multiple"
          :model-value="selected"
          :disabled="disabled"
        />
        <el-tooltip
          ref="tooltipRef"
          effect="light"
          :disabled="disabled || (!isTextOverflowing && !currentTip)"
          placement="right"
          popper-class="optionPopperClass"
        >
          <template #content>
            <div v-if="isTextOverflowing">{{ getLabel(item) }}</div>
            <div v-if="currentTip">{{ currentTip }}</div>
          </template>
          <div class="option-wrap-content">
            <slot name="optionIcon"></slot>
            <span
              class="select-label"
              :class="{ 'select-margin': $slots?.optionIcon }"
              >{{ getLabel(item) }}</span
            >
          </div>
        </el-tooltip>
        <div v-if="selected && !multiple" class="option-wrap-icon">
          <el-icon size="16px" color="#2A3F4D"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
            >
              <path
                d="M5.20006 14.2833C4.97716 14.2834 4.75643 14.2395 4.55052 14.1542C4.3446 14.0688 4.15754 13.9437 4.00006 13.786L0.292725 10.0807L1.70739 8.66665L5.20006 12.1593L14.2927 3.06665L15.7074 4.48065L6.40006 13.786C6.24257 13.9437 6.05552 14.0688 5.8496 14.1542C5.64369 14.2395 5.42296 14.2834 5.20006 14.2833Z"
              /></svg
          ></el-icon>
        </div>
      </div>
    </slot>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref } from 'vue'
import { get, isObject } from 'lodash-unified'
import {
  getPadding,
  isGreaterThan,
} from '@element-plus/components/table/src/util'
import ElCheckbox from '@element-plus/components/checkbox'
import ElIcon from '@element-plus/components/icon'
import ElTooltip from '@element-plus/components/tooltip'
import { useNamespace } from '@element-plus/hooks'
import { useOption } from './useOption'
import { useProps } from './useProps'
import { optionV2Emits, optionV2Props } from './defaults'
import { selectV2InjectionKey } from './token'

import type { Option } from './select.types'

export default defineComponent({
  components: { ElCheckbox, ElIcon, ElTooltip },
  props: optionV2Props,
  emits: optionV2Emits,
  setup(props, { emit }) {
    const select = inject(selectV2InjectionKey)!
    const isTextOverflowing = ref(false)
    const ns = useNamespace('select')
    const multiple = computed(() => select.props.multiple)
    const { hoverItem, selectOptionClick } = useOption(props, { emit })
    const { getLabel, getValue, getTip } = useProps(select.props)
    const currentTip = computed(() => getTip(props.item))
    const contentId = select.contentId
    const isItemSelected = (item?: Option) => {
      if (!item || item.type === 'Group' || !multiple.value) return false

      const values = Array.isArray(select.props.modelValue)
        ? select.props.modelValue
        : []
      const itemValue = getValue(item)

      if (!isObject(itemValue)) {
        return values.includes(itemValue)
      }

      return values.some(
        (value: unknown) =>
          get(value, select.props.valueKey) ===
          get(itemValue, select.props.valueKey)
      )
    }
    const selectedCount = computed(() => {
      if (!multiple.value || !Array.isArray(props.data)) return 0

      return props.data.filter((item: unknown) =>
        isItemSelected(item as Option)
      ).length
    })
    const showSelectedDivider = computed(() => {
      return (
        !props.selected &&
        multiple.value &&
        selectedCount.value > 0 &&
        props.index === selectedCount.value
      )
    })
    const optionStyle = computed(() => ({
      ...(props.style ?? {}),
      borderTop: showSelectedDivider.value ? '1px solid #E7ECEF' : 'none',
    }))
    const handleCellMouseEnter = (event: MouseEvent) => {
      const cellChild = (event.target as HTMLElement).querySelector(
        '.option-wrap-content'
      ) as HTMLElement
      if (!cellChild) return
      if (cellChild && !cellChild?.childNodes.length) {
        isTextOverflowing.value = false
        return
      }

      const range = document.createRange()
      range.setStart(cellChild, 0)
      range.setEnd(cellChild, cellChild.childNodes.length)
      const { width: rangeWidth, height: rangeHeight } =
        range.getBoundingClientRect()
      const { width: cellChildWidth, height: cellChildHeight } =
        cellChild.getBoundingClientRect()

      const { top, left, right, bottom } = getPadding(cellChild)
      const horizontalPadding = left + right
      const verticalPadding = top + bottom
      isTextOverflowing.value =
        isGreaterThan(rangeWidth + horizontalPadding, cellChildWidth) ||
        isGreaterThan(rangeHeight + verticalPadding, cellChildHeight) ||
        isGreaterThan(cellChild.scrollWidth, cellChildWidth)
    }
    return {
      ns,
      contentId,
      multiple,
      isTextOverflowing,
      currentTip,
      optionStyle,
      hoverItem,
      selectOptionClick,
      getLabel,
      handleCellMouseEnter,
    }
  },
})
</script>
