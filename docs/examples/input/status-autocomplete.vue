<template>
  <div class="demo-autocomplete-status">
    <el-autocomplete
      v-model="warningValue"
      :fetch-suggestions="querySearch"
      input-type="warning"
      clearable
      placeholder="Warning state"
    />
    <el-autocomplete
      v-model="errorValue"
      :fetch-suggestions="querySearch"
      input-type="error"
      clearable
      placeholder="Error state"
    />
    <el-autocomplete
      :fetch-suggestions="querySearch"
      input-type="error"
      info-tip="Custom required message"
      placeholder="Hover me when empty"
    />
    <el-autocomplete
      v-model="infoValue"
      :fetch-suggestions="querySearch"
      input-type="info"
      info-tip="Important Information"
      clearable
      placeholder="Info state"
    />
    <el-form-item error="Autocomplete is required" class="status-form-item">
      <el-autocomplete
        v-model="formValue"
        :fetch-suggestions="querySearch"
        input-type="info"
        info-tip="This info tip is hidden while the error tooltip is active"
        placeholder="Form validation has priority"
      />
    </el-form-item>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface SuggestionItem {
  value: string
}

const warningValue = ref('')
const errorValue = ref('Rate')
const infoValue = ref('')
const formValue = ref('')

const suggestions: SuggestionItem[] = [
  { value: 'Sand' },
  { value: 'Gravel' },
  { value: 'Cement' },
  { value: 'Asphalt' },
]

const querySearch = (
  queryString: string,
  cb: (data: SuggestionItem[]) => void
) => {
  const results = queryString
    ? suggestions.filter((item) =>
        item.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : suggestions

  cb(results)
}
</script>

<style scoped>
.demo-autocomplete-status {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.demo-autocomplete-status :deep(.el-autocomplete),
.status-form-item {
  width: 100%;
}

.status-form-item {
  margin-bottom: 0;
}
</style>
