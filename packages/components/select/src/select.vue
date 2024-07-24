<template>
  <div
    ref="selectRef"
    v-click-outside:[popperRef]="handleClickOutside"
    :class="[nsSelect.b(), nsSelect.m(selectSize)]"
    @[mouseEnterEventName]="states.inputHovering = true"
    @mouseleave="states.inputHovering = false"
    @click.prevent.stop="toggleMenu"
  >
    <el-tooltip
      ref="tooltipRef"
      :visible="dropdownMenuVisible"
      :placement="placement"
      :teleported="teleported"
      :popper-class="[nsSelect.e('popper'), popperClass]"
      :popper-options="popperOptions"
      :fallback-placements="fallbackPlacements"
      :effect="effect"
      pure
      trigger="click"
      :transition="`${nsSelect.namespace.value}-zoom-in-top`"
      :stop-popper-mouse-event="false"
      :gpu-acceleration="false"
      :persistent="persistent"
      @before-show="handleMenuEnter"
      @hide="states.isBeforeHide = false"
    >
      <template #default>
        <div
          ref="wrapperRef"
          :class="[
            nsSelect.e('wrapper'),
            nsSelect.is('focused', isFocused),
            nsSelect.is('hovering', states.inputHovering),
            nsSelect.is('filterable', filterable),
            nsSelect.is('disabled', selectDisabled),
            nsSelect.is('value', hasModelValue),
            preStar && !isFocused && !hasModelValue ? 'pre-star-item' : '',
          ]"
        >
          <span v-if="floatLabel" class="float-label">{{ placeholder }}</span>
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
            <slot v-if="multiple" name="tag">
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
                  @close="deleteTag($event, item)"
                >
                  <span :class="nsSelect.e('tags-text')">
                    <slot
                      name="label"
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
                        @close="deleteTag($event, item)"
                      >
                        <span :class="nsSelect.e('tags-text')">
                          <slot
                            name="label"
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
              v-if="!selectDisabled"
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
                :style="inputStyle"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                :aria-activedescendant="hoverOption?.id || ''"
                :aria-controls="contentId"
                :aria-expanded="dropdownMenuVisible"
                :aria-label="ariaLabel"
                aria-autocomplete="none"
                aria-haspopup="listbox"
                @focus="handleFocus"
                @blur="handleBlur"
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
                :label="currentPlaceholder"
                :value="modelValue"
              >
                <span>{{ currentPlaceholder }}</span>
              </slot>
            </div>
          </div>
          <div ref="suffixRef" :class="nsSelect.e('suffix')">
            <el-icon
              v-if="iconComponent && !showClose"
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
              v-if="showClose && clearIcon"
              :class="[nsSelect.e('caret'), nsSelect.e('icon')]"
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
            <el-icon
              v-if="validateState && validateIcon"
              :class="[nsInput.e('icon'), nsInput.e('validateIcon')]"
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
            v-show="states.options.size > 0 && !loading"
            :id="contentId"
            ref="scrollbarRef"
            tag="ul"
            :wrap-class="nsSelect.be('dropdown', 'wrap')"
            :view-class="nsSelect.be('dropdown', 'list')"
            :class="[nsSelect.is('empty', filteredOptionsCount === 0)]"
            role="listbox"
            :aria-label="ariaLabel"
            aria-orientation="vertical"
          >
            <el-option
              v-if="showNewOption"
              :value="states.inputValue"
              :created="true"
            />
            <el-options>
              <slot />
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
              <span>{{ emptyText }}</span>
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
// @ts-nocheck
import { defineComponent, provide, reactive } from 'vue'
import { ClickOutside } from '@element-plus/directives'
import ElTooltip from '@element-plus/components/tooltip'
import ElScrollbar from '@element-plus/components/scrollbar'
import ElTag from '@element-plus/components/tag'
import ElIcon from '@element-plus/components/icon'
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@element-plus/constants'
import ElOption from './option.vue'
import ElSelectMenu from './select-dropdown.vue'
import { useSelect } from './useSelect'
import { selectKey } from './token'
import ElOptions from './options'

import { SelectProps } from './select'
import type { SelectContext } from './token'

const COMPONENT_NAME = 'ElSelect'
export default defineComponent({
  name: COMPONENT_NAME,
  componentName: COMPONENT_NAME,
  components: {
    ElSelectMenu,
    ElOption,
    ElOptions,
    ElTag,
    ElScrollbar,
    ElTooltip,
    ElIcon,
  },
  directives: { ClickOutside },
  props: SelectProps,
  emits: [
    UPDATE_MODEL_EVENT,
    CHANGE_EVENT,
    'remove-tag',
    'clear',
    'visible-change',
    'focus',
    'blur',
  ],

  setup(props, { emit }) {
    const API = useSelect(props, emit)

    provide(
      selectKey,
      reactive({
        props,
        states: API.states,
        optionsArray: API.optionsArray,
        handleOptionSelect: API.handleOptionSelect,
        onOptionCreate: API.onOptionCreate,
        onOptionDestroy: API.onOptionDestroy,
        selectRef: API.selectRef,
        setSelected: API.setSelected,
      }) as unknown as SelectContext
    )

    return {
      ...API,
    }
  },
})
</script>
