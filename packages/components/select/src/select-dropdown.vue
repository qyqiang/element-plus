<template>
  <div
    :class="[ns.b('dropdown'), ns.is('multiple', isMultiple), popperClass]"
    :style="dropdownStyle"
  >
    <div v-if="$slots.header" :class="ns.be('dropdown', 'header')">
      <slot name="header" />
    </div>
    <slot />
    <div v-if="$slots.footer" :class="ns.be('dropdown', 'footer')">
      <slot name="footer" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { useNamespace } from '@element-plus/hooks'
import { addUnit } from '@element-plus/utils'
import { selectKey } from './token'
import { BORDER_HORIZONTAL_WIDTH } from '@element-plus/constants'

export default defineComponent({
  name: 'ElSelectDropdown',

  componentName: 'ElSelectDropdown',

  setup() {
    const select = inject(selectKey)!
    const ns = useNamespace('select')

    // computed
    const popperClass = computed(() => select.props.popperClass)
    const isMultiple = computed(() => select.props.multiple)
    const isFitInputWidth = computed(() => select.props.fitInputWidth)
    const optionWidth = computed(() => addUnit(select.props.optionWidth))
    const minWidth = ref('')
    const dropdownStyle = computed(() => {
      if (!isFitInputWidth.value && optionWidth.value) {
        return {
          width: optionWidth.value,
        }
      }
      return {
        [isFitInputWidth.value ? 'width' : 'minWidth']: minWidth.value,
      }
    })

    function updateMinWidth() {
      const offsetWidth = select.selectRef?.offsetWidth
      if (offsetWidth) {
        minWidth.value = `${offsetWidth - BORDER_HORIZONTAL_WIDTH}px`
      } else {
        minWidth.value = ''
      }
    }

    onMounted(() => {
      // TODO: updatePopper
      // popper.value.update()
      updateMinWidth()
      useResizeObserver(select.selectRef, updateMinWidth)
    })

    return {
      ns,
      minWidth,
      dropdownStyle,
      popperClass,
      isMultiple,
      isFitInputWidth,
    }
  },
})
</script>
