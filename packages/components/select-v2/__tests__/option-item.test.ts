import { nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import OptionItem from '../src/option-item.vue'
import { selectV2InjectionKey } from '../src/token'

const mountOption = (
  item: Record<string, unknown>,
  props: Record<string, string> = {},
  config: {
    optionProps?: Record<string, unknown>
    selectProps?: Record<string, unknown>
    slots?: Record<string, string>
  } = {}
) =>
  mount(OptionItem, {
    props: {
      data: [item],
      item,
      index: 0,
      selected: false,
      disabled: item.disabled === true,
      ...config.optionProps,
    },
    slots: config.slots,
    global: {
      provide: {
        namespace: 'el',
        [selectV2InjectionKey as symbol]: {
          props: {
            modelValue: '',
            multiple: false,
            props,
            valueKey: 'value',
            ...config.selectProps,
          },
          contentId: ref('select-v2-option-tip'),
        },
      },
    },
  })

describe('SelectV2 option tip', () => {
  it('clears the previous hover when moving to a disabled option', async () => {
    const wrapper = mountOption(
      {
        label: 'Disabled option',
        value: 'disabled',
        disabled: true,
      },
      {},
      {
        optionProps: {
          index: 1,
        },
      }
    )

    await wrapper.trigger('mousemove')

    expect(wrapper.emitted('hover')).toEqual([[-1]])
  })

  it('keeps the selected check area with custom option content', () => {
    const wrapper = mountOption(
      {
        label: 'Custom option',
        value: 'custom',
      },
      {},
      {
        optionProps: {
          selected: true,
        },
        slots: {
          default: '<div class="custom-option">Custom option</div>',
        },
      }
    )

    expect(wrapper.find('.custom-option').exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElTooltip' }).exists()).toBe(true)
    expect(wrapper.find('.option-wrap-icon svg').exists()).toBe(true)
  })

  it('keeps the checkbox area with custom multiple option content', () => {
    const wrapper = mountOption(
      {
        label: 'Custom option',
        value: 'custom',
      },
      {},
      {
        optionProps: {
          selected: true,
        },
        selectProps: {
          modelValue: ['custom'],
          multiple: true,
        },
        slots: {
          default: '<div class="custom-option">Custom option</div>',
        },
      }
    )

    expect(wrapper.find('.custom-option').exists()).toBe(true)
    expect(wrapper.find('.el-checkbox').exists()).toBe(true)
    expect(wrapper.find('.option-wrap-icon').exists()).toBe(false)
  })

  it('shows option tip with custom option content', () => {
    const wrapper = mountOption(
      {
        label: 'Custom option',
        value: 'custom',
        tip: 'Custom option tip',
      },
      {},
      {
        slots: {
          default: '<div class="custom-option">Rendered by slot</div>',
        },
      }
    )
    const tooltip = wrapper.findComponent({ name: 'ElTooltip' })
    const content = tooltip.vm.$slots
      .content?.()
      .map((node: { children: unknown }) => node.children)
      .filter((value: unknown) => value !== 'v-if')

    expect(wrapper.find('.custom-option').text()).toBe('Rendered by slot')
    expect(tooltip.props('trigger')).toBe('contextmenu')
    expect(tooltip.props('disabled')).toBe(false)
    expect(content).toEqual(['Custom option tip'])
  })

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

    expect(tooltip.props('trigger')).toBe('contextmenu')
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

  it('disables option tooltips from the select prop', () => {
    const wrapper = mountOption(
      {
        label: 'Option label',
        value: 'option',
        tip: 'Option tip',
      },
      {},
      {
        selectProps: {
          showOptionTooltip: false,
        },
      }
    )

    expect(wrapper.findComponent({ name: 'ElTooltip' }).props('disabled')).toBe(
      true
    )
  })
})
