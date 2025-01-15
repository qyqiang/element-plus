<template>
  <div
    :class="[
      containerKls,
      {
        [nsInput.bm('group', 'append')]: $slots.append,
        [nsInput.bm('group', 'prepend')]: $slots.prepend,
      },
    ]"
    :style="containerStyle"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" :class="nsInput.be('group', 'prepend')">
        <slot name="prepend" />
      </div>

      <div ref="wrapperRef" :class="wrapperKls">
        <!-- prefix slot -->
        <span v-if="$slots.prefix || prefixIcon" :class="nsInput.e('prefix')">
          <span :class="nsInput.e('prefix-inner')">
            <slot name="prefix" />
            <el-icon v-if="prefixIcon" :class="nsInput.e('icon')" size="12px">
              <component :is="prefixIcon" />
            </el-icon>
          </span>
        </span>
        <input
          :id="inputId"
          ref="input"
          required
          :class="nsInput.e('inner')"
          v-bind="attrs"
          :minlength="minlength"
          :maxlength="maxlength"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="inputDisabled"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :tabindex="tabindex"
          :aria-label="ariaLabel"
          :placeholder="placeholder"
          :style="inputStyle"
          :form="form"
          :autofocus="autofocus"
          :role="containerRole"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @change="handleChange"
          @keydown="handleKeydown"
        />
        <span
          v-if="floatLabel"
          class="float-label"
          :class="{ 'prefix-label': $slots.prefix || prefixIcon }"
          >{{ placeholder }}</span
        >

        <!-- suffix slot -->
        <span v-if="suffixVisible" :class="nsInput.e('suffix')">
          <span :class="nsInput.e('suffix-inner')">
            <template
              v-if="!showClear || !showPwdVisible || !isWordLimitVisible"
            >
              <slot name="suffix" />
              <el-icon v-if="suffixIcon" :class="nsInput.e('icon')">
                <component :is="suffixIcon" />
              </el-icon>
            </template>
            <el-icon
              v-if="showClear"
              :class="[nsInput.e('icon'), nsInput.e('clear')]"
              @mousedown.prevent="NOOP"
              @click="clear"
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
              v-if="showPwdVisible"
              :class="[nsInput.e('icon'), nsInput.e('password')]"
              @click="handlePasswordVisible"
            >
              <svg
                v-if="passwordVisible"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="24"
                height="24"
                fill="#1a1f36"
                viewBox="0 0 24 24"
              >
                <path
                  id="ujy5xle6ka"
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
              <svg
                v-else
                width="18"
                fill="#1a1f36"
                height="18"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  id="a"
                  d="M9 5.25c2.07 0 3.75 1.68 3.75 3.75 0 .488-.098.945-.27 1.373l2.19 2.19A8.863 8.863 0 0 0 17.242 9c-1.297-3.293-4.5-5.625-8.25-5.625-1.05 0-2.055.188-2.985.525l1.62 1.62A3.64 3.64 0 0 1 9 5.25zM1.5 3.203l1.71 1.71.345.345A8.853 8.853 0 0 0 .75 9c1.297 3.293 4.5 5.625 8.25 5.625a8.832 8.832 0 0 0 3.285-.63l.315.315 2.197 2.19.953-.953L2.453 2.25l-.953.953zM5.647 7.35 6.81 8.512c-.037.158-.06.323-.06.488A2.247 2.247 0 0 0 9 11.25c.165 0 .33-.023.488-.06l1.162 1.162A3.717 3.717 0 0 1 9 12.75c-2.07 0-3.75-1.68-3.75-3.75 0-.592.15-1.147.397-1.65zm3.233-.585 2.362 2.362.015-.12a2.247 2.247 0 0 0-2.25-2.25l-.127.008z"
                />
              </svg>
            </el-icon>
            <span v-if="isWordLimitVisible" :class="nsInput.e('count')">
              <span :class="nsInput.e('count-inner')">
                {{ textLength }} / {{ maxlength }}
              </span>
            </span>
            <el-icon
              v-if="validateState && validateIcon && needStatusIcon"
              :class="[
                nsInput.e('icon'),
                nsInput.e('validateIcon'),
                nsInput.is('loading', validateState === 'validating'),
              ]"
              v-html="validateIcon"
            />
          </span>
        </span>
      </div>

      <!-- append slot -->
      <div v-if="$slots.append" :class="nsInput.be('group', 'append')">
        <slot name="append" />
      </div>
    </template>
    <!-- textarea -->
    <template v-else>
      <textarea
        :id="inputId"
        ref="textarea"
        :class="[nsTextarea.e('inner'), nsInput.is('focus', isFocused)]"
        v-bind="attrs"
        :minlength="minlength"
        :maxlength="maxlength"
        :tabindex="tabindex"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :style="textareaStyle"
        :aria-label="ariaLabel"
        :placeholder="placeholder"
        :form="form"
        :autofocus="autofocus"
        :rows="rows"
        :role="containerRole"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keydown="handleKeydown"
      />
      <span v-if="floatLabel" class="float-label">{{ placeholder }}</span>
      <span
        v-if="isWordLimitVisible"
        :style="countStyle"
        :class="nsInput.e('count')"
      >
        {{ textLength }} / {{ maxlength }}
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  toRef,
  useAttrs as useRawAttrs,
  useSlots,
  watch,
} from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { isNil } from 'lodash-unified'
import { ElIcon } from '@element-plus/components/icon'
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from '@element-plus/components/form'
import {
  NOOP,
  ValidateComponentsMap,
  debugWarn,
  isClient,
  isObject,
} from '@element-plus/utils'
import {
  useAttrs,
  useComposition,
  useCursor,
  useFocusController,
  useNamespace,
} from '@element-plus/hooks'
import { UPDATE_MODEL_EVENT } from '@element-plus/constants'
import { calcTextareaHeight } from './utils'
import { inputEmits, inputProps } from './input'
import type { StyleValue } from 'vue'

type TargetElement = HTMLInputElement | HTMLTextAreaElement

defineOptions({
  name: 'ElInput',
  inheritAttrs: false,
})
const props = defineProps(inputProps)
const emit = defineEmits(inputEmits)

const rawAttrs = useRawAttrs()
const attrs = useAttrs()
const slots = useSlots()

const containerKls = computed(() => [
  props.type === 'textarea' ? nsTextarea.b() : nsInput.b(),
  nsInput.m(inputSize.value),
  nsInput.is('disabled', inputDisabled.value),
  nsInput.is('exceed', inputExceed.value),
  {
    [nsInput.b('group')]: slots.prepend || slots.append,
    [nsInput.m('prefix')]: slots.prefix || props.prefixIcon,
    [nsInput.m('suffix')]:
      slots.suffix || props.suffixIcon || props.clearable || props.showPassword,
    [nsInput.bm('suffix', 'password-clear')]:
      showClear.value && showPwdVisible.value,
    [nsInput.b('hidden')]: props.type === 'hidden',
  },
  rawAttrs.class,
])

const wrapperKls = computed(() => [
  nsInput.e('wrapper'),
  nsInput.is('focus', isFocused.value),
  props.preStar && !isFocused.value && !textLength.value ? 'pre-star-item' : '',
])

const { form: elForm, formItem: elFormItem } = useFormItem()
const { inputId } = useFormItemInputId(props, {
  formItemContext: elFormItem,
})
const inputSize = useFormSize()
const inputDisabled = useFormDisabled()
const nsInput = useNamespace('input')
const nsTextarea = useNamespace('textarea')

const input = shallowRef<HTMLInputElement>()
const textarea = shallowRef<HTMLTextAreaElement>()

const hovering = ref(false)
const passwordVisible = ref(false)
const countStyle = ref<StyleValue>()
const textareaCalcStyle = shallowRef(props.inputStyle)

const _ref = computed(() => input.value || textarea.value)

// wrapperRef for type="text", handleFocus and handleBlur for type="textarea"
const { wrapperRef, isFocused, handleFocus, handleBlur } = useFocusController(
  _ref,
  {
    beforeFocus() {
      return inputDisabled.value
    },
    afterBlur() {
      if (props.validateEvent) {
        elFormItem?.validate?.('blur').catch((err) => debugWarn(err))
      }
    },
  }
)

const needStatusIcon = computed(() => elForm?.statusIcon ?? false)
const validateState = computed(() => elFormItem?.validateState || '')
const validateIcon = computed(
  () => validateState.value && ValidateComponentsMap[validateState.value]
)
const containerStyle = computed<StyleValue>(() => [
  rawAttrs.style as StyleValue,
])
const textareaStyle = computed<StyleValue>(() => [
  props.inputStyle,
  textareaCalcStyle.value,
  { resize: props.resize },
])
const nativeInputValue = computed(() =>
  isNil(props.modelValue) ? '' : String(props.modelValue)
)
const showClear = computed(
  () =>
    props.clearable &&
    !inputDisabled.value &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (isFocused.value || hovering.value)
)
const showPwdVisible = computed(
  () =>
    props.showPassword &&
    !inputDisabled.value &&
    !!nativeInputValue.value &&
    (!!nativeInputValue.value || isFocused.value)
)
const isWordLimitVisible = computed(
  () =>
    props.showWordLimit &&
    !!props.maxlength &&
    (props.type === 'text' || props.type === 'textarea') &&
    !inputDisabled.value &&
    !props.readonly &&
    !props.showPassword
)
const textLength = computed(() => nativeInputValue.value.length)
const inputExceed = computed(
  () =>
    // show exceed style if length of initial value greater then maxlength
    !!isWordLimitVisible.value && textLength.value > Number(props.maxlength)
)
const suffixVisible = computed(
  () =>
    !!slots.suffix ||
    !!props.suffixIcon ||
    showClear.value ||
    props.showPassword ||
    isWordLimitVisible.value ||
    (!!validateState.value && needStatusIcon.value)
)

const [recordCursor, setCursor] = useCursor(input)

useResizeObserver(textarea, (entries) => {
  onceInitSizeTextarea()
  if (!isWordLimitVisible.value || props.resize !== 'both') return
  const entry = entries[0]
  const { width } = entry.contentRect
  countStyle.value = {
    /** right: 100% - width + padding(15) + right(6) */
    right: `calc(100% - ${width + 15 + 6}px)`,
  }
})

const resizeTextarea = () => {
  const { type, autosize } = props

  if (!isClient || type !== 'textarea' || !textarea.value) return

  if (autosize) {
    const minRows = isObject(autosize) ? autosize.minRows : undefined
    const maxRows = isObject(autosize) ? autosize.maxRows : undefined
    const textareaStyle = calcTextareaHeight(textarea.value, minRows, maxRows)

    // If the scrollbar is displayed, the height of the textarea needs more space than the calculated height.
    // If set textarea height in this case, the scrollbar will not hide.
    // So we need to hide scrollbar first, and reset it in next tick.
    // see https://github.com/element-plus/element-plus/issues/8825
    textareaCalcStyle.value = {
      overflowY: 'hidden',
      ...textareaStyle,
    }

    nextTick(() => {
      // NOTE: Force repaint to make sure the style set above is applied.
      textarea.value!.offsetHeight
      textareaCalcStyle.value = textareaStyle
    })
  } else {
    textareaCalcStyle.value = {
      minHeight: calcTextareaHeight(textarea.value).minHeight,
    }
  }
}

const createOnceInitResize = (resizeTextarea: () => void) => {
  let isInit = false
  return () => {
    if (isInit || !props.autosize) return
    const isElHidden = textarea.value?.offsetParent === null
    if (!isElHidden) {
      resizeTextarea()
      isInit = true
    }
  }
}
// fix: https://github.com/element-plus/element-plus/issues/12074
const onceInitSizeTextarea = createOnceInitResize(resizeTextarea)

const setNativeInputValue = () => {
  const input = _ref.value
  const formatterValue = props.formatter
    ? props.formatter(nativeInputValue.value)
    : nativeInputValue.value
  if (!input || input.value === formatterValue) return
  input.value = formatterValue
}

const handleInput = async (event: Event) => {
  recordCursor()

  let { value } = event.target as TargetElement

  if (props.formatter) {
    value = props.parser ? props.parser(value) : value
  }

  // should not emit input during composition
  // see: https://github.com/ElemeFE/element/issues/10516
  if (isComposing.value) return

  // hack for https://github.com/ElemeFE/element/issues/8548
  // should remove the following line when we don't support IE
  if (value === nativeInputValue.value) {
    setNativeInputValue()
    return
  }

  emit(UPDATE_MODEL_EVENT, value)
  emit('input', value)

  // ensure native input value is controlled
  // see: https://github.com/ElemeFE/element/issues/12850
  await nextTick()
  setNativeInputValue()
  setCursor()
}

const handleChange = (event: Event) => {
  emit('change', (event.target as TargetElement).value)
}

const {
  isComposing,
  handleCompositionStart,
  handleCompositionUpdate,
  handleCompositionEnd,
} = useComposition({ emit, afterComposition: handleInput })

const handlePasswordVisible = () => {
  recordCursor()
  passwordVisible.value = !passwordVisible.value
  // The native input needs a little time to regain focus
  setTimeout(setCursor)
}

const focus = () => _ref.value?.focus()

const blur = () => _ref.value?.blur()

const handleMouseLeave = (evt: MouseEvent) => {
  hovering.value = false
  emit('mouseleave', evt)
}

const handleMouseEnter = (evt: MouseEvent) => {
  hovering.value = true
  emit('mouseenter', evt)
}

const handleKeydown = (evt: KeyboardEvent) => {
  emit('keydown', evt)
}

const select = () => {
  _ref.value?.select()
}

const clear = () => {
  emit(UPDATE_MODEL_EVENT, '')
  emit('change', '')
  emit('clear')
  emit('input', '')
}

watch(
  () => props.modelValue,
  () => {
    nextTick(() => resizeTextarea())
    if (props.validateEvent) {
      elFormItem?.validate?.('change').catch((err) => debugWarn(err))
    }
  }
)

// native input value is set explicitly
// do not use v-model / :value in template
// see: https://github.com/ElemeFE/element/issues/14521
watch(nativeInputValue, () => setNativeInputValue())

// when change between <input> and <textarea>,
// update DOM dependent value and styles
// https://github.com/ElemeFE/element/issues/14857
watch(
  () => props.type,
  async () => {
    await nextTick()
    setNativeInputValue()
    resizeTextarea()
  }
)

onMounted(() => {
  if (!props.formatter && props.parser) {
    debugWarn(
      'ElInput',
      'If you set the parser, you also need to set the formatter.'
    )
  }
  setNativeInputValue()
  nextTick(resizeTextarea)
})

defineExpose({
  /** @description HTML input element */
  input,
  /** @description HTML textarea element */
  textarea,
  /** @description HTML element, input or textarea */
  ref: _ref,
  /** @description style of textarea. */
  textareaStyle,

  /** @description from props (used on unit test) */
  autosize: toRef(props, 'autosize'),

  /** @description is input composing */
  isComposing,

  /** @description HTML input element native method */
  focus,
  /** @description HTML input element native method */
  blur,
  /** @description HTML input element native method */
  select,
  /** @description clear input value */
  clear,
  /** @description resize textarea. */
  resizeTextarea,
})
</script>
