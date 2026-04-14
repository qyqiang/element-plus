<template>
  <div
    ref="selectRef"
    v-click-outside:[popperRef]="handleClickOutside"
    :class="[
      nsSelect.b(),
      nsSelect.m(selectSize),
      multiple && isFocused ? 'multi-select' : '',
    ]"
    @[mouseEnterEventName]="states.inputHovering = true"
    @mouseleave="states.inputHovering = false"
  >
    <el-tooltip
      ref="tooltipRef"
      :visible="dropdownMenuVisible"
      :placement="placement"
      :teleported="teleported"
      :popper-class="[nsSelect.e('popper'), popperClass]"
      :popper-style="popperStyle"
      :popper-options="popperOptions"
      :fallback-placements="fallbackPlacements"
      :effect="effect"
      pure
      trigger="click"
      :transition="`${nsSelect.namespace.value}-zoom-in-top`"
      :stop-popper-mouse-event="false"
      :gpu-acceleration="false"
      :persistent="persistent"
      :append-to="appendTo"
      :show-arrow="false"
      :offset="offset"
      @before-show="handleMenuEnter"
      @hide="states.isBeforeHide = false"
    >
      <template #default>
        <div
          ref="wrapperRef"
          :class="[
            nsSelect.e('wrapper'),
            nsSelect.is('focused', isFocused),
            nsSelect.is('all', !!haveAll),
            nsSelect.is('hovering', states.inputHovering),
            nsSelect.is('filterable', filterable),
            nsSelect.is('disabled', selectDisabled),
            nsSelect.is('value', hasModelValue),
          ]"
          @click.prevent="toggleMenu"
        >
          <span
            v-if="floatLabel"
            class="float-label"
            :class="{
              'prefix-label': $slots.prefix,
              'select-visible':
                dropdownMenuVisible || !isEmpty(states.inputValue),
            }"
          >
            {{ placeholder }}
          </span>
          <div
            v-if="$slots.prefix"
            ref="prefixRef"
            :class="nsSelect.e('prefix')"
          >
            <slot name="prefix" />
          </div>
          <div
            ref="selectionRef"
            :class="[
              nsSelect.e('selection'),
              nsSelect.is(
                'near',
                multiple && !$slots.prefix && !!states.selected.length
              ),
            ]"
          >
            <slot
              v-if="multiple"
              name="tag"
              :data="states.selected"
              :delete-tag="deleteTag"
              :select-disabled="selectDisabled"
            >
              <span
                v-if="haveAll && !states.selected.length"
                class="select-all-tag"
                >{{ haveAll }}</span
              >
              <div
                v-for="item in showTagList"
                :key="getValueKey(item)"
                :class="nsSelect.e('selected-item')"
              >
                <el-tag
                  :closable="!selectDisabled && !item.isDisabled"
                  :size="collapseTagSize"
                  :type="tagType"
                  :effect="tagEffect"
                  disable-transitions
                  :style="tagStyle"
                  round
                  @close="deleteTag($event, item)"
                >
                  <span :class="nsSelect.e('tags-text')">
                    <slot
                      name="label"
                      :index="item.index"
                      :label="item.currentLabel"
                      :value="item.value"
                    >
                      {{ item.currentLabel }}
                    </slot>
                  </span>
                </el-tag>
              </div>

              <el-tooltip
                v-if="collapseTags && states.selected.length > maxCollapseTags"
                ref="tagTooltipRef"
                :disabled="dropdownMenuVisible || !collapseTagsTooltip"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
                :effect="effect"
                placement="bottom"
                :popper-class="popperClass"
                :popper-style="popperStyle"
                :teleported="teleported"
              >
                <template #default>
                  <div
                    ref="collapseItemRef"
                    :class="nsSelect.e('selected-item')"
                  >
                    <el-tag
                      :closable="false"
                      :size="collapseTagSize"
                      :type="tagType"
                      :effect="tagEffect"
                      disable-transitions
                      :style="collapseTagStyle"
                      round
                    >
                      <span :class="nsSelect.e('tags-text')">
                        + {{ states.selected.length - maxCollapseTags }}
                      </span>
                    </el-tag>
                  </div>
                </template>
                <template #content>
                  <div ref="tagMenuRef" :class="nsSelect.e('selection')">
                    <div
                      v-for="item in collapseTagList"
                      :key="getValueKey(item)"
                      :class="nsSelect.e('selected-item')"
                    >
                      <el-tag
                        class="in-tooltip"
                        :closable="!selectDisabled && !item.isDisabled"
                        :size="collapseTagSize"
                        :type="tagType"
                        :effect="tagEffect"
                        disable-transitions
                        round
                        @close="deleteTag($event, item)"
                      >
                        <span :class="nsSelect.e('tags-text')">
                          <slot
                            name="label"
                            :index="item.index"
                            :label="item.currentLabel"
                            :value="item.value"
                          >
                            {{ item.currentLabel }}
                          </slot>
                        </span>
                      </el-tag>
                    </div>
                  </div>
                </template>
              </el-tooltip>
            </slot>
            <div
              :class="[
                nsSelect.e('selected-item'),
                nsSelect.e('input-wrapper'),
                nsSelect.is('hidden', !filterable),
              ]"
            >
              <input
                :id="inputId"
                ref="inputRef"
                v-model="states.inputValue"
                type="text"
                :name="name"
                :class="[nsSelect.e('input'), nsSelect.is(selectSize)]"
                :disabled="selectDisabled"
                :autocomplete="autocomplete"
                :maxlength="filterMaxLength"
                :style="inputStyle"
                :tabindex="tabindex"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                :aria-activedescendant="hoverOption?.id || ''"
                :aria-controls="contentId"
                :aria-expanded="dropdownMenuVisible"
                :aria-label="ariaLabel"
                aria-autocomplete="none"
                aria-haspopup="listbox"
                @keydown.down.stop.prevent="navigateOptions('next')"
                @keydown.up.stop.prevent="navigateOptions('prev')"
                @keydown.esc.stop.prevent="handleEsc"
                @keydown.enter.stop.prevent="selectOption"
                @keydown.delete.stop="deletePrevTag"
                @compositionstart="handleCompositionStart"
                @compositionupdate="handleCompositionUpdate"
                @compositionend="handleCompositionEnd"
                @input="onInput"
                @click.stop="toggleMenu"
              />
              <span
                v-if="filterable"
                ref="calculatorRef"
                aria-hidden="true"
                :class="nsSelect.e('input-calculator')"
                v-text="states.inputValue"
              />
            </div>

            <div
              v-if="
                (!floatLabel && !states.inputValue) ||
                (shouldShowPlaceholder && hasModelValue)
              "
              :class="[
                nsSelect.e('selected-item'),
                nsSelect.e('placeholder'),
                nsSelect.is(
                  'transparent',
                  !hasModelValue || (expanded && !states.inputValue)
                ),
              ]"
            >
              <slot
                name="label"
                :index="getOption(modelValue!).index"
                :label="currentPlaceholder"
                :value="modelValue"
              >
                <span>{{ currentPlaceholder }}</span>
              </slot>
            </div>
          </div>
          <div ref="suffixRef" :class="nsSelect.e('suffix')">
            {{ labelSuffix }}
            <template v-if="$slots.info">
              <slot name="info" />
            </template>
            <template v-if="$slots.suffixBeforeIcon">
              <slot name="suffixBeforeIcon" />
            </template>
            <el-icon
              v-if="
                iconComponent && !showClearBtn && !validateError && !$slots.info
              "
              :class="[nsSelect.e('caret'), nsSelect.e('icon'), iconReverse]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  d="M5.99992 7.75002C5.86862 7.75024 5.73856 7.72452 5.61723 7.67432C5.4959 7.62413 5.38569 7.55045 5.29292 7.45752L2.64642 4.81052L3.35342 4.10352L5.99992 6.75002L8.64642 4.10352L9.35342 4.81052L6.70692 7.45702C6.6142 7.55004 6.50401 7.62381 6.38267 7.67409C6.26134 7.72438 6.13126 7.75018 5.99992 7.75002Z"
                />
              </svg>
            </el-icon>
            <el-icon
              v-if="showClearBtn && clearIcon"
              :class="[
                nsSelect.e('caret'),
                nsSelect.e('icon'),
                nsSelect.e('clear'),
              ]"
              @click="handleClearClick"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 12 12"
              >
                <path
                  d="M9.35349 3.35342L8.64648 2.64642L5.99998 5.29292L3.35348 2.64642L2.64648 3.35342L5.29298 5.99992L2.64648 8.64642L3.35348 9.35342L5.99998 6.70692L8.64648 9.35342L9.35349 8.64642L6.70698 5.99992L9.35349 3.35342Z"
                />
              </svg>
            </el-icon>
            <template v-if="$slots.suffixAfterIcon">
              <slot name="suffixAfterIcon" />
            </template>
            <el-tooltip
              v-if="validateError"
              :content="validateMsg"
              effect="light"
              placement="top"
              :offset="4"
            >
              <el-icon class="error-icon" color="#A1160A">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M6.00041 1C8.00045 1 6.75037 5.25 6.75037 5.25C6.75037 5.25 10.1112 2.75 11.0004 4.5C11.8896 6.25 7.25037 6.75 7.25037 6.75C7.25037 6.75 10.7186 9.88284 9.25035 10.9496C7.78208 12.0164 6.00037 7.5 6.00037 7.5C6.00037 7.5 4.23586 12.0164 2.76759 10.9496C1.29932 9.88283 4.75037 6.75 4.75037 6.75C4.75037 6.75 0.250258 6.25 1.00035 4.5C1.75045 2.75 5.25037 5.25 5.25037 5.25C5.25037 5.25 4.00037 1 6.00041 1Z"
                  />
                </svg>
              </el-icon>
            </el-tooltip>
            <el-icon
              v-if="validateState && validateIcon"
              :class="[
                nsInput.e('icon'),
                nsInput.e('validateIcon'),
                nsInput.is('loading', validateState === 'validating'),
              ]"
              v-html="validateIcon"
            />
          </div>
        </div>
      </template>
      <template #content>
        <el-select-menu ref="menuRef">
          <div
            v-if="$slots.header"
            :class="nsSelect.be('dropdown', 'header')"
            @click.stop
          >
            <slot name="header" />
          </div>
          <el-scrollbar
            v-show="(states.options.size > 0 || addItem) && !loading"
            :id="contentId"
            ref="scrollbarRef"
            tag="ul"
            :wrap-class="nsSelect.be('dropdown', 'wrap')"
            :view-class="nsSelect.be('dropdown', 'list')"
            :class="[nsSelect.is('empty', filteredOptionsCount === 0)]"
            role="listbox"
            :aria-label="ariaLabel"
            aria-orientation="vertical"
            @scroll="popupScroll"
          >
            <div
              v-if="states.selected.length && haveAll"
              class="select-all-item"
            >
              {{ haveAll }}
            </div>
            <div v-if="addShowTip && filterable" class="select-add-tip">
              {{ addShowTip }}
            </div>
            <el-option
              v-if="showNewOption"
              :value="states.inputValue"
              :created="true"
            />
            <el-options>
              <slot>
                <template v-for="(option, index) in options" :key="index">
                  <el-option-group
                    v-if="getOptions(option)?.length"
                    :label="getLabel(option)"
                    :disabled="getDisabled(option)"
                  >
                    <el-option
                      v-for="item in getOptions(option)"
                      :key="getValue(item)"
                      v-bind="getOptionProps(item)"
                    />
                  </el-option-group>
                  <el-option v-else v-bind="getOptionProps(option)" />
                </template>
              </slot>
            </el-options>
          </el-scrollbar>
          <div
            v-if="$slots.loading && loading"
            :class="nsSelect.be('dropdown', 'loading')"
          >
            <slot name="loading" />
          </div>
          <div
            v-else-if="loading || filteredOptionsCount === 0"
            :class="nsSelect.be('dropdown', 'empty')"
          >
            <slot name="empty">
              <span v-if="!addItem">{{ emptyText }}</span>
              <div
                v-else
                class="el-select-dropdown__item add-item"
                @click="handleAddSelect"
              >
                <el-icon color="#4f566">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_743_39597)">
                      <path
                        d="M12 5.25H6.75V0H5.25V5.25H0V6.75H5.25V12H6.75V6.75H12V5.25Z"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_743_39597">
                        <rect width="12" height="12" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </el-icon>
                <span class="tip">{{ states.inputValue }}</span>
              </div>
            </slot>
          </div>
          <div
            v-if="$slots.footer"
            :class="nsSelect.be('dropdown', 'footer')"
            @click.stop
          >
            <slot name="footer" />
          </div>
        </el-select-menu>
      </template>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  provide,
  reactive,
  toRefs,
  watch,
} from 'vue'
import { ClickOutside } from '@element-plus/directives'
import ElTooltip from '@element-plus/components/tooltip'
import ElScrollbar from '@element-plus/components/scrollbar'
import ElTag from '@element-plus/components/tag'
import ElIcon from '@element-plus/components/icon'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import {
  flattedChildren,
  isArray,
  isEmpty,
  isObject,
} from '@element-plus/utils'
import { useCalcInputWidth } from '@element-plus/hooks'
import { useProps } from '@element-plus/components/select-v2/src/useProps'
import ElOption from './option.vue'
import ElSelectMenu from './select-dropdown.vue'
import { useSelect } from './useSelect'
import { selectKey } from './token'
import ElOptions from './options'
import { selectProps } from './select'
import ElOptionGroup from './option-group.vue'

import type { VNode } from 'vue'
import type { SelectContext } from './type'

const COMPONENT_NAME = 'ElSelect'
export default defineComponent({
  name: COMPONENT_NAME,
  componentName: COMPONENT_NAME,
  components: {
    ElSelectMenu,
    ElOption,
    ElOptions,
    ElOptionGroup,
    ElTag,
    ElScrollbar,
    ElTooltip,
    ElIcon,
  },
  directives: { ClickOutside },
  props: selectProps,
  emits: [
    UPDATE_MODEL_EVENT,
    CHANGE_EVENT,
    'remove-tag',
    'add-item',
    'clear',
    'visible-change',
    'focus',
    'blur',
    'popup-scroll',
  ],

  setup(props, { emit, slots }) {
    const instance = getCurrentInstance()!
    const originalWarnHandler = instance.appContext.config.warnHandler
    instance.appContext.config.warnHandler = (...args) => {
      // Overrides warnings about slots not being executable outside of a render function.
      // We call slot below just to simulate data when persist is false, this warning message should be ignored
      if (
        !args[0] ||
        args[0].includes(
          'Slot "default" invoked outside of the render function'
        )
      ) {
        return
      }
      // eslint-disable-next-line no-console
      console.warn(...args)
    }
    const modelValue = computed(() => {
      const { modelValue: rawModelValue, multiple } = props
      const fallback = multiple ? [] : undefined
      // When it is array, we check if this is multi-select.
      // Based on the result we get
      if (isArray(rawModelValue)) {
        return multiple ? rawModelValue : fallback
      }

      return multiple ? fallback : rawModelValue
    })

    const _props = reactive({
      ...toRefs(props),
      modelValue,
    })

    const API = useSelect(_props, emit)
    const { calculatorRef, inputStyle } = useCalcInputWidth()
    const { getLabel, getValue, getOptions, getDisabled } = useProps(props)
    const validateError = computed(() => API?.validateState.value === 'error')
    const validateMsg = computed(() => API?.validateMessage.value || '')
    const getOptionProps = (option: Record<string, any>) => ({
      label: getLabel(option),
      value: getValue(option),
      disabled: getDisabled(option),
    })

    const flatTreeSelectData = (data: any[]) => {
      return data.reduce((acc, item) => {
        acc.push(item)
        if (item.children && item.children.length > 0) {
          acc.push(...flatTreeSelectData(item.children))
        }
        return acc
      }, [])
    }
    const handleAddSelect = () => {
      emit('add-item', API.states.inputValue)
    }
    const manuallyRenderSlots = (vnodes: VNode[] | undefined) => {
      // After option rendering is completed, the useSelect internal state can collect the value of each option.
      // If the persistent value is false, option will not be rendered by default, so in this case,
      // manually render and load option data here.
      const children = flattedChildren(vnodes || []) as VNode[]
      children.forEach((item) => {
        if (
          isObject(item) &&
          // @ts-expect-error
          (item.type.name === 'ElOption' || item.type.name === 'ElTree')
        ) {
          // @ts-expect-error
          const _name = item.type.name
          if (_name === 'ElTree') {
            // tree-select component is a special case.
            // So we need to handle it separately.
            const treeData = item.props?.data || []
            const flatData = flatTreeSelectData(treeData)
            flatData.forEach((treeItem: any) => {
              treeItem.currentLabel =
                treeItem.label ||
                (isObject(treeItem.value) ? '' : treeItem.value)
              API.onOptionCreate(treeItem)
            })
          } else if (_name === 'ElOption') {
            const obj = { ...item.props } as any
            obj.currentLabel =
              obj.label || (isObject(obj.value) ? '' : obj.value)
            API.onOptionCreate(obj)
          }
        }
      })
    }
    watch(
      () => [slots.default?.(), modelValue.value],
      () => {
        if (props.persistent || API.states.options.size > 0) {
          // If persistent is true, we don't need to manually render slots.
          return
        }
        manuallyRenderSlots(slots.default?.())
      },
      {
        immediate: true,
      }
    )

    provide(
      selectKey,
      reactive({
        props: _props,
        states: API.states,
        selectRef: API.selectRef,
        optionsArray: API.optionsArray,
        setSelected: API.setSelected,
        handleOptionSelect: API.handleOptionSelect,
        onOptionCreate: API.onOptionCreate,
        onOptionDestroy: API.onOptionDestroy,
      }) satisfies SelectContext
    )

    const selectedLabel = computed(() => {
      if (!props.multiple) {
        return API.states.selectedLabel
      }
      return API.states.selected.map((i) => i.currentLabel as string)
    })

    onBeforeUnmount(() => {
      // https://github.com/element-plus/element-plus/issues/21279
      instance.appContext.config.warnHandler = originalWarnHandler
    })

    return {
      ...API,
      modelValue,
      selectedLabel,
      calculatorRef,
      inputStyle,
      validateError,
      validateMsg,
      handleAddSelect,
      getLabel,
      isEmpty,
      getValue,
      getOptions,
      getDisabled,
      getOptionProps,
    }
  },
})
</script>
