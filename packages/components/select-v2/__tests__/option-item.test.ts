import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import OptionItem from '../src/option-item.vue'
import { selectV2InjectionKey } from '../src/token'

const mountOption = (
  item: Record<string, unknown>,
  props: Record<string, string> = {}
) =>
  mount(OptionItem, {
    props: {
      data: [item],
      item,
      index: 0,
      selected: false,
      disabled: item.disabled === true,
    },
    global: {
      provide: {
        namespace: 'el',
        [selectV2InjectionKey as symbol]: {
          props: {
            modelValue: '',
            multiple: false,
            props,
            valueKey: 'value',
          },
          contentId: ref('select-v2-option-tip'),
        },
      },
    },
  })

describe('SelectV2 option tip', () => {
  it('shows only tip for fitting text and adds the label when it overflows', async () => {
    const wrapper = mountOption({
      label: 'Short label',
      value: 'short',
      tip: 'Supplementary tip',
    })
    const tooltip = wrapper.findComponent({ name: 'ElTooltip' })
    const getTooltipLines = () =>
      tooltip.vm.$slots
        .content?.()
        .map((node: { children: unknown }) => node.children)
        .filter((content: unknown) => content !== 'v-if')

    expect(tooltip.props('disabled')).toBe(false)
    expect(getTooltipLines()).toEqual(['Supplementary tip'])
    ;(wrapper.vm as any).isTextOverflowing = true
    await nextTick()

    expect(getTooltipLines()).toEqual(['Short label', 'Supplementary tip'])
  })

  it('supports a custom tip field alias', () => {
    const wrapper = mountOption(
      {
        label: 'Short label',
        value: 'short',
        helpText: 'Custom tip',
      },
      { tip: 'helpText' }
    )
    const tooltip = wrapper.findComponent({ name: 'ElTooltip' })
    const content = tooltip.vm.$slots
      .content?.()
      .map((node: { children: unknown }) => node.children)
      .filter((value: unknown) => value !== 'v-if')

    expect(content).toEqual(['Custom tip'])
  })

  it('shows tip for a disabled option', () => {
    const wrapper = mountOption({
      label: 'Disabled option',
      value: 'disabled',
      tip: 'Disabled option tip',
      disabled: true,
    })
    const tooltip = wrapper.findComponent({ name: 'ElTooltip' })
    const content = tooltip.vm.$slots
      .content?.()
      .map((node: { children: unknown }) => node.children)
      .filter((value: unknown) => value !== 'v-if')

    expect(wrapper.props('disabled')).toBe(true)
    expect(tooltip.props('disabled')).toBe(false)
    expect(content).toEqual(['Disabled option tip'])
  })
})
