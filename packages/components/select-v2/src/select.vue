<template>
  <div
    ref="selectRef"
    v-click-outside:[popperRef]="handleSelectClickOutside"
    :class="[
      nsSelect.b(),
      nsSelect.m(selectSize),
      nsSelect.m(inputType),
      {
        [nsSelect.m('inputType')]: !!inputType,
        [nsSelect.m('filled')]: !!inputType && hasModelValue,
      },
      multiple && isFocused ? 'multi-select' : '',
    ]"
    @mouseenter="states.inputHovering = true"
    @mouseleave="states.inputHovering = false"
  >
    <el-tooltip
      trigger="click"
      effect="light"
      placement="top"
      :offset="4"
      :content="errorTooltipContent"
      :disabled="errorTooltipDisabled"
      :visible="errorTooltipVisible"
    >
      <div
        :class="[
          nsSelect.e('container'),
          nsSelect.is('append', !!$slots.append),
        ]"
      >
        <el-tooltip
          ref="tooltipRef"
          :visible="dropdownMenuVisible"
          :teleported="teleported"
          :popper-class="[nsSelect.e('popper'), popperClass!]"
          :popper-style="popperStyle"
          :gpu-acceleration="false"
          :stop-popper-mouse-event="false"
          :popper-options="popperOptions"
          :fallback-placements="fallbackPlacements"
          :effect="effect"
          :placement="placement"
          pure
          :transition="`${nsSelect.namespace.value}-zoom-in-top`"
          trigger="click"
          :persistent="persistent"
          :append-to="appendTo"
          :show-arrow="showArrow"
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
              @click.prevent="handleSelectClick"
            >
              <span
                v-if="floatLabel"
                class="float-label"
                :class="{
                  'prefix-label': $slots.prefix,
                  'select-visible': dropdownMenuVisible || !!states.inputValue,
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
                    multiple && !$slots.prefix && !!modelValue.length
                  ),
                ]"
              >
                <slot
                  v-if="multiple"
                  name="tag"
                  :data="states.cachedOptions"
                  :delete-tag="deleteTag"
                  :select-disabled="selectDisabled"
                >
                  <span
                    v-if="haveAll && !states.cachedOptions.length"
                    class="select-all-tag"
                    >{{ haveAll }}</span
                  >
                  <div
                    v-for="item in showTagList"
                    :key="getValueKey(getValue(item))"
                    :class="nsSelect.e('selected-item')"
                  >
                    <el-tag
                      :closable="!selectDisabled && !getDisabled(item)"
                      :size="collapseTagSize"
                      :type="tagType"
                      :effect="tagEffect"
                      disable-transitions
                      :style="tagStyle"
                      @close="deleteTag($event, item)"
                    >
                      <span :class="nsSelect.e('tags-text')">
                        <slot
                          name="label"
                          :index="getIndex(item)"
                          :label="getLabel(item)"
                          :value="getValue(item)"
                        >
                          {{ getLabel(item) }}
                        </slot>
                      </span>
                    </el-tag>
                  </div>

                  <el-tooltip
                    v-if="collapseTags && modelValue.length > maxCollapseTags"
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
                          :style="collapseTagStyle"
                          disable-transitions
                        >
                          <span :class="nsSelect.e('tags-text')">
                            + {{ modelValue.length - maxCollapseTags }}
                          </span>
                        </el-tag>
                      </div>
                    </template>
                    <template #content>
                      <div ref="tagMenuRef" :class="nsSelect.e('selection')">
                        <div
                          v-for="selected in collapseTagList"
                          :key="getValueKey(getValue(selected))"
                          :class="nsSelect.e('selected-item')"
                        >
                          <el-tag
                            class="in-tooltip"
                            :closable="
                              !selectDisabled && !getDisabled(selected)
                            "
                            :size="collapseTagSize"
                            :type="tagType"
                            :effect="tagEffect"
                            disable-transitions
                            @close="deleteTag($event, selected)"
                          >
                            <span :class="nsSelect.e('tags-text')">
                              <slot
                                name="label"
                                :index="getIndex(selected)"
                                :label="getLabel(selected)"
                                :value="getValue(selected)"
                              >
                                {{ getLabel(selected) }}
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
                    :style="inputStyle"
                    :autocomplete="autocomplete"
                    :tabindex="tabindex"
                    aria-autocomplete="none"
                    aria-haspopup="listbox"
                    autocapitalize="off"
                    :aria-expanded="expanded"
                    :aria-label="ariaLabel"
                    :class="[nsSelect.e('input'), nsSelect.is(selectSize)]"
                    :disabled="selectDisabled"
                    role="combobox"
                    :aria-controls="contentId"
                    :aria-activedescendant="
                      states.hoveringIndex >= 0
                        ? `${contentId}-${states.hoveringIndex}`
                        : ''
                    "
                    :readonly="!filterable"
                    spellcheck="false"
                    type="text"
                    :name="name"
                    @input="onInput"
                    @compositionstart="handleCompositionStart"
                    @compositionupdate="handleCompositionUpdate"
                    @compositionend="handleCompositionEnd"
                    @keydown.up.stop.prevent="onKeyboardNavigate('backward')"
                    @keydown.down.stop.prevent="onKeyboardNavigate('forward')"
                    @keydown.enter.stop.prevent="onKeyboardSelect"
                    @keydown.esc.stop.prevent="handleEsc"
                    @keydown.delete.stop="handleDel"
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
                  v-if="shouldShowPlaceholder && hasModelValue"
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
                    :index="allOptionsValueMap.get(modelValue)?.index ?? -1"
                    :label="currentPlaceholder"
                    :value="modelValue"
                  >
                    <span>{{ currentPlaceholder }}</span>
                  </slot>
                </div>
              </div>
              <div ref="suffixRef" :class="nsSelect.e('suffix')">
                <template v-if="iconComponent">
                  <div
                    v-if="$slots?.suffix"
                    v-show="!showClearBtn"
                    class="tip-wrap"
                  >
                    <slot name="suffix"></slot>
                  </div>
                  <el-icon
                    v-else
                    v-show="!showClearBtn"
                    :class="[
                      nsSelect.e('caret'),
                      nsInput.e('icon'),
                      iconReverse,
                    ]"
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
                </template>

                <el-icon
                  v-if="showClearBtn && clearIcon"
                  :class="[
                    nsSelect.e('caret'),
                    nsInput.e('icon'),
                    nsSelect.e('clear'),
                  ]"
                  @click.prevent.stop="handleClear"
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
              </div>
            </div>
          </template>
          <template #content>
            <el-select-menu
              :id="contentId"
              ref="menuRef"
              :data="filteredOptions"
              :width="popperSize - BORDER_HORIZONTAL_WIDTH"
              :hovering-index="states.hoveringIndex"
              :scrollbar-always-on="scrollbarAlwaysOn"
              :aria-label="ariaLabel"
            >
              <template
                v-if="
                  $slots.header || (multiple && modelValue.length && haveAll)
                "
                #header
              >
                <div
                  v-if="$slots.header"
                  :class="nsSelect.be('dropdown', 'header')"
                  @click.stop
                >
                  <slot name="header" />
                </div>
                <div
                  v-if="multiple && modelValue.length && haveAll"
                  class="select-all-item"
                >
                  {{ haveAll }}
                </div>
              </template>
              <template #default="scope">
                <slot v-bind="scope" />
              </template>
              <template v-if="$slots.loading && loading" #loading>
                <div :class="nsSelect.be('dropdown', 'loading')">
                  <slot name="loading" />
                </div>
              </template>
              <template
                v-else-if="loading || filteredOptions.length === 0"
                #empty
              >
                <div :class="nsSelect.be('dropdown', 'empty')">
                  <slot name="empty">
                    <span>{{ emptyText }}</span>
                  </slot>
                </div>
              </template>
              <template v-if="$slots.footer" #footer>
                <div :class="nsSelect.be('dropdown', 'footer')" @click.stop>
                  <slot name="footer" />
                </div>
              </template>
            </el-select-menu>
          </template>
        </el-tooltip>
        <div
          v-if="$slots.append"
          :class="nsSelect.e('append')"
          @mousedown.stop
          @click.stop
        >
          <slot name="append" />
        </div>
      </div>
    </el-tooltip>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  provide,
  reactive,
  ref,
  toRefs,
  watch,
} from 'vue'
import { isArray } from '@element-plus/utils'
import { ClickOutside } from '@element-plus/directives'
import ElTooltip from '@element-plus/components/tooltip'
import ElTag from '@element-plus/components/tag'
import ElIcon from '@element-plus/components/icon'
import { useCalcInputWidth, useId } from '@element-plus/hooks'
import ElSelectMenu from './select-dropdown'
import useSelect from './useSelect'
import { selectV2Emits, selectV2Props } from './defaults'
import { selectV2InjectionKey } from './token'
import { BORDER_HORIZONTAL_WIDTH } from '@element-plus/constants'

export default defineComponent({
  name: 'ElSelectV2',
  components: {
    ElSelectMenu,
    ElTag,
    ElTooltip,
    ElIcon,
  },
  directives: { ClickOutside },
  props: selectV2Props,
  emits: selectV2Emits,
  setup(props, { emit }) {
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

    const API = useSelect(
      reactive({
        ...toRefs(props),
        modelValue,
      }),
      emit
    )
    const { calculatorRef, inputStyle } = useCalcInputWidth()
    const contentId = useId()
    const validateError = computed(() => API?.validateState.value === 'error')
    const validateMsg = computed(() => API?.validateMessage.value || '')
    const showEmptyErrorTooltip = computed(
      () => props.inputType === 'error' && !API.hasModelValue.value
    )
    const errorTooltipContent = computed(() => {
      if (validateError.value && validateMsg.value) return validateMsg.value
      if (showEmptyErrorTooltip.value) return 'Required'
      return ''
    })
    const errorTooltipDisabled = computed(() => !errorTooltipContent.value)
    const errorTooltipVisible = ref(false)
    const handleSelectClick = () => {
      API.toggleMenu()
      errorTooltipVisible.value = !errorTooltipDisabled.value
    }
    const handleSelectClickOutside = (event: Event) => {
      errorTooltipVisible.value = false
      API.handleClickOutside(event)
    }
    watch([API.isFocused, errorTooltipDisabled], ([focused, disabled]) => {
      errorTooltipVisible.value = focused && !disabled
    })
    provide(selectV2InjectionKey, {
      props: reactive({
        ...toRefs(props),
        height: API.popupHeight,
        modelValue,
      }),
      expanded: API.expanded,
      tooltipRef: API.tooltipRef,
      contentId,
      onSelect: API.onSelect,
      onHover: API.onHover,
      onKeyboardNavigate: API.onKeyboardNavigate,
      onKeyboardSelect: API.onKeyboardSelect,
    })

    const selectedLabel = computed(() => {
      if (!props.multiple) {
        return API.states.selectedLabel
      }
      return API.states.cachedOptions.map((i) => API.getLabel(i) as string)
    })

    return {
      ...API,
      modelValue,
      selectedLabel,
      calculatorRef,
      inputStyle,
      validateError,
      validateMsg,
      errorTooltipContent,
      errorTooltipDisabled,
      errorTooltipVisible,
      handleSelectClick,
      handleSelectClickOutside,
      contentId,
      BORDER_HORIZONTAL_WIDTH,
    }
  },
})
</script>
