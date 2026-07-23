import { defineComponent, onMounted, onUpdated, ref, renderSlot } from 'vue'
import ElTooltip from '@element-plus/components/tooltip'
import { tableV2CellProps } from '../cell'

const TableV2Cell = defineComponent({
  name: 'ElTableV2Cell',
  inheritAttrs: false,
  props: tableV2CellProps,
  setup(props, { slots }) {
    const contentRef = ref<HTMLElement>()
    const isOverflowing = ref(false)

    const updateOverflow = () => {
      const element = contentRef.value
      if (!props.showOverflowTooltip || !element) {
        isOverflowing.value = false
        return
      }
      isOverflowing.value = Boolean(
        element.scrollWidth > element.clientWidth ||
          element.scrollHeight > element.clientHeight
      )
    }

    onMounted(updateOverflow)
    onUpdated(updateOverflow)

    return () => {
      const { cellData, showOverflowTooltip, style } = props
      const displayText = cellData?.toString?.() || ''
      const defaultSlot = renderSlot(slots, 'default', props, () => [
        displayText,
      ])
      const content = (
        <div
          ref={contentRef}
          class={props.class}
          title={showOverflowTooltip ? undefined : displayText}
          style={style}
          onMouseenter={showOverflowTooltip ? updateOverflow : undefined}
        >
          {defaultSlot}
        </div>
      )

      if (!showOverflowTooltip) return content

      const tooltipOptions =
        typeof showOverflowTooltip === 'object' ? showOverflowTooltip : {}

      return (
        <ElTooltip
          effect="light"
          placement="top"
          {...tooltipOptions}
          content={displayText}
          disabled={!isOverflowing.value}
        >
          {content}
        </ElTooltip>
      )
    }
  },
})

export default TableV2Cell
