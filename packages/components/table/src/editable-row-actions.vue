<template>
  <div v-if="isEditing" class="editable-row-actions">
    <el-button
      :type="isSaving ? 'text' : 'default'"
      class="icon-button ml-2"
      @click="handleSave"
    >
      <el-icon v-if="isSaving" size="12px" class="is-loading" color="#9FB1BD">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <path
            d="M7.99992 3.33317C10.5772 3.33317 12.6666 5.42251 12.6666 7.99984C12.6666 10.5772 10.5772 12.6665 7.99992 12.6665C5.42259 12.6665 3.33325 10.5772 3.33325 7.99984L1.33325 7.99984C1.33325 11.6817 4.31802 14.6665 7.99992 14.6665C11.6818 14.6665 14.6666 11.6817 14.6666 7.99984C14.6666 4.31794 11.6818 1.33317 7.99992 1.33317L7.99992 3.33317Z"
          />
        </svg>
      </el-icon>
      <el-icon v-else size="12px" color="#2A3F4D">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 12 12"
        >
          <path
            d="M3.82026 11.0063C3.64674 11.0064 3.4749 10.9712 3.3146 10.9027C3.1543 10.8343 3.00868 10.7339 2.88608 10.6073L0 7.63422L1.10129 6.49966L3.82026 9.3021L10.8987 2.00635L12 3.14091L4.75443 10.6073C4.63183 10.7339 4.48621 10.8343 4.32591 10.9027C4.16561 10.9712 3.99378 11.0064 3.82026 11.0063Z"
          />
        </svg>
      </el-icon>
    </el-button>
    <el-button
      :disabled="isSaving"
      class="icon-button mr-2 ml-0!"
      @click="handleCancel"
    >
      <el-icon size="12px" :color="isSaving ? '#DCE3E8' : '#2A3F4D'">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="11"
          height="11"
          viewBox="0 0 11 11"
        >
          <path
            d="M9.5 -3.86973e-06L10.6875 1.18749L1.18752 10.6875L2.18131e-05 9.49997L9.5 -3.86973e-06Z"
          />
          <path
            d="M10.6875 9.49998L9.50001 10.6875L1.45229e-05 1.18749L1.18751 -1.1465e-05L10.6875 9.49998Z"
          />
        </svg>
      </el-icon>
    </el-button>
  </div>
  <slot v-else></slot>
</template>

<script lang="ts" setup>
import { computed, inject, ref } from 'vue'
import ElButton from '@element-plus/components/button'
import ElIcon from '@element-plus/components/icon'
import { TABLE_INJECTION_KEY } from './tokens'

import type { PropType } from 'vue'
import type { DefaultRow, Table } from './table/defaults'

const props = defineProps({
  row: {
    type: Object as PropType<DefaultRow>,
    required: true,
  },
  beforeSave: {
    type: Function as PropType<(payload: DefaultRow) => Promise<void> | void>,
    default: undefined,
  },
})

const emit = defineEmits<{
  (event: 'save', payload: DefaultRow): void
  (event: 'cancel', payload: { row: DefaultRow; draft: DefaultRow }): void
  (event: 'save-error', error: unknown): void
}>()

const table = inject(TABLE_INJECTION_KEY) as Table<DefaultRow> | undefined
const isSaving = ref(false)
const isEditing = computed(() => table?.editingRow?.value?.row === props.row)

const handleSave = async () => {
  const editingRow = table?.editingRow?.value
  if (!editingRow || editingRow.row !== props.row || isSaving.value) return

  isSaving.value = true

  try {
    await props.beforeSave?.(editingRow.draft)
    const saved = table?.applyEditingRow?.()
    if (saved) {
      emit('save', saved.draft)
    }
    table?.clearEditingRow?.()
  } catch (error) {
    emit('save-error', error)
  } finally {
    isSaving.value = false
  }
}

const handleCancel = () => {
  const editingRow = table?.editingRow?.value
  if (!editingRow || editingRow.row !== props.row || isSaving.value) return
  emit('cancel', {
    row: props.row,
    draft: editingRow.draft,
  })
  table?.clearEditingRow?.()
}
</script>
