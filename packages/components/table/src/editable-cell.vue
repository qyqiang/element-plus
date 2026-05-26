<template>
  <div
    ref="cellRef"
    class="editable-table-cell"
    :class="{
      'is-editing': isEditing,
      'is-click': isClickedEditingCell,
    }"
    @click.prevent
    @editable-cell-focus="handleExternalFocus"
  >
    <slot
      v-if="isEditing && hasEditorSlot"
      name="editor"
      :model-value="editorModel"
      :value="editorModel"
      :cell-data="cellData"
      :property="property"
      :editor="editor"
      :is-editing="isEditing"
      :options="options"
      :input-props="inputProps"
      :select-props="selectProps"
      :update-model-value="updateModelValue"
      :commit-value="commitValue"
      :submit-editing="submitEditing"
    />
    <el-select
      v-else-if="isEditing && editor === 'select'"
      ref="selectRef"
      v-model="editorModel"
      v-bind="selectProps"
      :automatic-dropdown="isActiveEditingCell"
      :clearable="clearable"
      @change="handleSelectChange"
      @visible-change="handleSelectVisibleChange"
    >
      <el-option
        v-for="option in options"
        :key="option[selectKey[0]]"
        :label="option[selectKey[1]]"
        :value="option[selectKey[0]]"
      />
    </el-select>
    <el-input
      v-else-if="isEditing"
      ref="inputRef"
      v-model="editorModel"
      v-price="isNumber"
      :clearable="clearable"
      v-bind="inputProps"
      :autofocus="isActiveEditingCell"
      @blur="handleInputBlur"
      @change="handleInputChange"
    />
    <p v-else class="editable-table-cell__text">{{ displayValue }}</p>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, useSlots, watch } from 'vue'
import { getProp, isEmpty } from '@element-plus/utils'
import ElInput from '@element-plus/components/input'
import { ElOption, ElSelect } from '@element-plus/components/select'
import { TABLE_INJECTION_KEY } from './tokens'

import type { Directive, PropType } from 'vue'
import type { DefaultRow, Table } from './table/defaults'

type NumericLimit = boolean | number | { place?: number }

type PriceDirectiveElement = HTMLElement & {
  _priceCleanup?: () => void
}

const DEFAULT_DECIMAL_PRECISION = 2

const resolvePrecision = (value: NumericLimit | undefined) => {
  if (value === false || value === undefined || value === null) return null
  if (value === true) return DEFAULT_DECIMAL_PRECISION
  if (typeof value === 'number') return Math.max(0, value)
  if (typeof value === 'object') {
    return Math.max(0, value.place ?? DEFAULT_DECIMAL_PRECISION)
  }
  return null
}

const sanitizeNumericValue = (value: string, precision: number) => {
  let next = value.replace(/[^\d.]/g, '')
  const firstDotIndex = next.indexOf('.')

  if (firstDotIndex !== -1) {
    const integerPart = next.slice(0, firstDotIndex)
    const decimalPart = next
      .slice(firstDotIndex + 1)
      .replace(/\./g, '')
      .slice(0, precision)

    next = precision === 0 ? integerPart : `${integerPart}.${decimalPart}`
  }

  if (next.startsWith('.')) {
    next = `0${next}`
  }

  return next
}

const normalizeNumericValue = (value: string, precision: number) => {
  const normalized = sanitizeNumericValue(value, precision)
  return normalized.endsWith('.') ? normalized.slice(0, -1) : normalized
}

const bindPriceDirective = (
  el: PriceDirectiveElement,
  value: NumericLimit | undefined
) => {
  el._priceCleanup?.()
  const precision = resolvePrecision(value)
  if (precision === null) return

  const input = el.querySelector('input') as HTMLInputElement | null
  if (!input) return

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const next = sanitizeNumericValue(target.value, precision)
    if (next !== target.value) {
      target.value = next
    }
  }

  const handleBlur = (event: Event) => {
    const target = event.target as HTMLInputElement
    const next = normalizeNumericValue(target.value, precision)
    if (next !== target.value) {
      target.value = next
      target.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  input.addEventListener('input', handleInput, true)
  input.addEventListener('blur', handleBlur, true)

  el._priceCleanup = () => {
    input.removeEventListener('input', handleInput, true)
    input.removeEventListener('blur', handleBlur, true)
  }
}

const vPrice: Directive<HTMLElement, NumericLimit> = {
  mounted(el, binding) {
    bindPriceDirective(el as PriceDirectiveElement, binding.value)
  },
  updated(el, binding) {
    bindPriceDirective(el as PriceDirectiveElement, binding.value)
  },
  beforeUnmount(el) {
    ;(el as PriceDirectiveElement)._priceCleanup?.()
  },
}

const props = defineProps({
  cellData: {
    type: Object as PropType<{
      row: DefaultRow
      cellIndex: number
      rowIndex: number
    }>,
    required: true,
  },
  property: {
    type: String,
    required: true,
  },
  displayKey: String,
  clearable: {
    type: Boolean,
    default: true,
  },
  isNumber: {
    type: [Boolean, Number, Object] as PropType<NumericLimit>,
    default: false,
  },
  editor: {
    type: String as PropType<'input' | 'select'>,
    default: 'input',
  },
  inputProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  selectProps: {
    type: Object as PropType<Record<string, any>>,
    default: () => ({}),
  },
  selectKey: {
    type: Array as PropType<string[]>,
    default: () => ['value', 'label'],
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
})

const emit = defineEmits(['on-submit', 'blur', 'change', 'visible-change'])

const slots = useSlots()
const table = inject(TABLE_INJECTION_KEY) as Table<DefaultRow> | undefined
const cellRef = ref<HTMLElement>()
const inputRef = ref<InstanceType<typeof ElInput>>()
const selectRef = ref<InstanceType<typeof ElSelect>>()
const draftValue = ref(getProp(props.cellData.row, props.property).value)
const hasEditorSlot = computed(() => !!slots.editor)
const activeEditableCell = computed(() => table?.activeEditableCell?.value)

const currentValue = computed(() => {
  if (
    table?.editingRow?.value &&
    table.editingRow.value.row === props.cellData.row
  ) {
    return getProp(table.editingRow.value.draft, props.property).value
  }
  return getProp(props.cellData.row, props.property).value
})
const isEditing = computed(() => {
  if (!table?.props.editable) return false
  return table?.editingRow?.value?.row === props.cellData.row
})
const isActiveEditingCell = computed(() => {
  if (!isEditing.value) return false
  const editingRow = table?.editingRow?.value
  return (
    editingRow?.row === props.cellData.row &&
    editingRow?.prop === props.property
  )
})
const isClickedEditingCell = computed(() => {
  return activeEditableCell?.value
    ? activeEditableCell?.value.cellIndex === props.cellData.cellIndex &&
        activeEditableCell?.value.rowIndex === props.cellData.rowIndex
    : false
})
const editorModel = computed({
  get() {
    return currentValue.value
  },
  set(value) {
    if (
      table?.editingRow?.value &&
      table.editingRow.value.row === props.cellData.row
    ) {
      getProp(table.editingRow.value.draft, props.property).value = value
      return
    }
    draftValue.value = value
  },
})

const displayValue = computed(() => {
  const displayValue = getProp(
    props.cellData.row,
    props.displayKey as any
  ).value
  const propertyValue = getProp(props.cellData.row, props.property).value
  return isEmpty(displayValue) ? propertyValue : displayValue
})

const syncDraftValue = () => {
  draftValue.value = currentValue.value
}

const commitValue = () => {
  getProp(props.cellData.row, props.property).value = draftValue.value
  emit('on-submit', draftValue.value)
}

const updateModelValue = (value: any) => {
  editorModel.value = value
}

const submitEditing = (value = editorModel.value) => {
  updateModelValue(value)
}

const handleInputBlur = () => {
  emit('blur', editorModel.value)
}

const handleInputChange = () => {
  emit('change', editorModel.value)
}

const handleSelectChange = (value: any) => {
  editorModel.value = value
  emit('change', editorModel.value)
}

const handleSelectVisibleChange = (visible: boolean) => {
  emit('visible-change', visible)
}

const focusEditorFromCellClick = async () => {
  if (hasEditorSlot.value || !isEditing.value) return
  if (props.editor === 'select') {
    selectRef.value?.focus?.()
    selectRef.value?.toggleMenu?.()
  } else {
    inputRef.value?.focus?.()
  }
}

const handleExternalFocus = () => {
  focusEditorFromCellClick()
}

watch(
  currentValue,
  () => {
    if (!isEditing.value) {
      syncDraftValue()
    }
  },
  {
    immediate: true,
  }
)
</script>
