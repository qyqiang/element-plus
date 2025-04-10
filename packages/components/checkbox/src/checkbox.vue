<template>
  <component
    :is="!hasOwnLabel && isLabeledByFormItem ? 'span' : 'label'"
    :class="compKls"
    :aria-controls="indeterminate ? ariaControls : null"
    @click="onClickRoot"
  >
    <span :class="spanKls">
      <input
        v-if="trueValue || falseValue || trueLabel || falseLabel"
        :id="inputId"
        v-model="model"
        :class="ns.e('original')"
        type="checkbox"
        :indeterminate="indeterminate"
        :name="name"
        :tabindex="tabindex"
        :disabled="isDisabled"
        :true-value="trueValue ?? trueLabel ?? true"
        :false-value="falseValue ?? falseLabel ?? false"
        @change="handleChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @click.stop
      />
      <input
        v-else
        :id="inputId"
        v-model="model"
        :class="ns.e('original')"
        type="checkbox"
        :indeterminate="indeterminate"
        :disabled="isDisabled"
        :value="actualValue"
        :name="name"
        :tabindex="tabindex"
        @change="handleChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @click.stop
      />
      <span :class="ns.e('inner')">
        <el-icon :color="iconColor" size="12px"
          ><svg
            v-if="isChecked && !indeterminate"
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
          >
            <path
              d="M3.90004 10.7125C3.73287 10.7126 3.56732 10.6796 3.41289 10.6156C3.25845 10.5516 3.11816 10.4578 3.00004 10.3395L0.219543 7.56049L1.28054 6.49999L3.90004 9.11949L10.7195 2.29999L11.7805 3.36049L4.80004 10.3395C4.68193 10.4578 4.54164 10.5516 4.3872 10.6156C4.23276 10.6796 4.06722 10.7126 3.90004 10.7125Z"
            /></svg
        ></el-icon>
      </span>
    </span>
    <span v-if="hasOwnLabel" :class="ns.e('label')">
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import ElIcon from '@element-plus/components/icon/src/icon.vue'
import { useNamespace } from '@element-plus/hooks'
import { checkboxEmits, checkboxProps } from './checkbox'
import { useCheckbox } from './composables'

defineOptions({
  name: 'ElCheckbox',
})

const props = defineProps(checkboxProps)
defineEmits(checkboxEmits)
const slots = useSlots()

const {
  inputId,
  isLabeledByFormItem,
  isChecked,
  isDisabled,
  isFocused,
  checkboxSize,
  hasOwnLabel,
  model,
  actualValue,
  handleChange,
  onClickRoot,
} = useCheckbox(props, slots)

const ns = useNamespace('checkbox')
const iconColor = computed(() => {
  return props.isShow ? '#2a3f4d' : isChecked.value ? '#fff' : '#2a3f4d'
})
const compKls = computed(() => {
  return [
    ns.b(),
    ns.m(checkboxSize.value),
    ns.is('disabled', isDisabled.value),
    ns.is('bordered', props.border),
    ns.is('show', props.isShow),
    ns.is('checked', isChecked.value),
  ]
})

const spanKls = computed(() => {
  return [
    ns.e('input'),
    ns.is('disabled', isDisabled.value),
    ns.is('checked', isChecked.value),
    ns.is('indeterminate', props.indeterminate),
    ns.is('focus', isFocused.value),
  ]
})
</script>
