<template>
  <span v-if="!isEditing" class="editable-table-cell" @click="handleEdit">
    {{ row?.[property] }}
  </span>
  <div v-else>
    <el-input
      ref="inputRef"
      v-model="data"
      size="large"
      style="width: 100%"
      @blur="handleBlur"
    />
  </div>
</template>
<script setup lang="ts">
import { nextTick, ref } from 'vue'

const props = defineProps({
  row: {
    type: Object,
    default: () => {},
  },
  property: {
    type: String,
    default: '',
  },
})
const emit = defineEmits(['onSubmit'])

const inputRef = ref()
const isEditing = ref(false)
const data = ref(props.row[props.property])

const handleEdit = () => {
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleBlur = () => {
  if (data.value !== props.row?.[props.property]) {
    emit('onSubmit', data.value)
  }
  isEditing.value = false
}
</script>

<style scoped>
.editable-table-cell {
  &:hover {
    cursor: pointer;
  }
}
</style>
