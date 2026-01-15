<template>
  <li
    v-show="visible"
    :id="id"
    :class="containerKls"
    role="option"
    :aria-disabled="isDisabled || undefined"
    :aria-selected="itemSelected"
    @mousemove="hoverItem"
    @click.stop="selectOptionClick"
    @mouseenter="handleCellMouseEnter"
  >
    <slot>
      <div class="option-wrap">
        <el-tooltip
          ref="tooltipRef"
          effect="light"
          :disabled="!showTip || disabled"
          :content="currentLabel"
          :placement="placement"
          popper-class="optionPopperClass"
        >
          <div class="option-wrap-content">
            <slot name="optionIcon"></slot>
            <span
              class="select-label"
              :class="{ 'select-margin': $slots?.optionIcon }"
              >{{ currentLabel }}</span
            >
          </div>
        </el-tooltip>
        <div v-show="itemSelected" class="option-wrap-icon">
          <el-icon size="16px">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M5.20006 14.2833C4.97716 14.2834 4.75643 14.2395 4.55052 14.1542C4.3446 14.0688 4.15754 13.9437 4.00006 13.786L0.292725 10.0807L1.70739 8.66665L5.20006 12.1593L14.2927 3.06665L15.7074 4.48065L6.40006 13.786C6.24257 13.9437 6.05552 14.0688 5.8496 14.1542C5.64369 14.2395 5.42296 14.2834 5.20006 14.2833Z"
                fill="#2A3F4D"
              />
            </svg>
          </el-icon>
        </div>
      </div>
    </slot>
  </li>
</template>

<script lang="ts">
// @ts-nocheck
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeUnmount,
  reactive,
  ref,
  toRefs,
  unref,
} from 'vue'
import { useId, useNamespace } from '@element-plus/hooks'
import { useOption } from './useOption'
import { COMPONENT_NAME, optionProps } from './option'
import ElIcon from '@element-plus/components/icon'
import ElTooltip from '@element-plus/components/tooltip'

import type {
  OptionExposed,
  OptionInternalInstance,
  OptionStates,
} from './type'

export default defineComponent({
  name: COMPONENT_NAME,
  componentName: COMPONENT_NAME,
  components: {
    ElIcon,
    ElTooltip,
  },
  props: optionProps,

  setup(props) {
    const ns = useNamespace('select')
    const id = useId()
    const disabled = ref(false)
    const containerKls = computed(() => [
      ns.be('dropdown', 'item'),
      ns.is('disabled', unref(isDisabled)),
      ns.is('selected', unref(itemSelected)),
      ns.is('hovering', unref(hover)),
    ])

    const states = reactive<OptionStates>({
      index: -1,
      groupDisabled: false,
      visible: true,
      hover: false,
    })

    const {
      currentLabel,
      itemSelected,
      isDisabled,
      select,
      hoverItem,
      updateOption,
    } = useOption(props, states)

    const { visible, hover } = toRefs(states)

    const vm = (getCurrentInstance()! as OptionInternalInstance).proxy

    select.onOptionCreate(vm)

    onBeforeUnmount(() => {
      const key = vm.value

      // if option is not selected, remove it from cache
      nextTick(() => {
        const { selected: selectedOptions } = select.states
        const doesSelected = selectedOptions.some((item) => {
          return item.value === vm.value
        })
        if (select.states.cachedOptions.get(key) === vm && !doesSelected) {
          select.states.cachedOptions.delete(key)
        }
      })
      select.onOptionDestroy(key, vm)
    })

    function selectOptionClick() {
      if (!isDisabled.value) {
        select.handleOptionSelect(vm)
      }
    }
    function isGreaterThan(a: number, b: number, epsilon = 0.03) {
      return a - b > epsilon
    }
    const getPadding = (el: HTMLElement) => {
      const style = window.getComputedStyle(el, null)
      const paddingLeft = Number.parseInt(style.paddingLeft, 10) || 0
      const paddingRight = Number.parseInt(style.paddingRight, 10) || 0
      const paddingTop = Number.parseInt(style.paddingTop, 10) || 0
      const paddingBottom = Number.parseInt(style.paddingBottom, 10) || 0
      return {
        left: paddingLeft,
        right: paddingRight,
        top: paddingTop,
        bottom: paddingBottom,
      }
    }
    const handleCellMouseEnter = (event: MouseEvent) => {
      const cellChild = (event.target as HTMLElement).querySelector(
        '.option-wrap-content'
      ) as HTMLElement
      if (!cellChild) return
      if (cellChild && !cellChild?.childNodes.length) {
        disabled.value = false
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
      disabled.value = !(
        isGreaterThan(rangeWidth + horizontalPadding, cellChildWidth) ||
        isGreaterThan(rangeHeight + verticalPadding, cellChildHeight) ||
        isGreaterThan(cellChild.scrollWidth, cellChildWidth)
      )
    }

    return {
      ns,
      id,
      containerKls,
      currentLabel,
      itemSelected,
      isDisabled,
      select,
      visible,
      hover,
      states,
      disabled,
      showTip: props.showTip,
      placement: props.placement,
      handleCellMouseEnter,
      hoverItem,
      updateOption,
      selectOptionClick,
    } satisfies OptionExposed
  },
})
</script>
