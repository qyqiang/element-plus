<template>
  <div class="append-action-demo">
    <el-select-v2
      v-model="value"
      :options="options"
      placeholder="Trailer Alias"
      style="width: 320px"
    >
      <template #append>
        <button
          class="append-action-button"
          type="button"
          aria-label="Open trailer settings"
          @click="actionCount++"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 6h5m4 0h7M11 4v4M4 12h9m4 0h3m-5-2v4M4 18h3m4 0h9M9 16v4"
            />
          </svg>
        </button>
      </template>
    </el-select-v2>
    <span>Action clicks: {{ actionCount }}</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref('TRL-20490')
const actionCount = ref(0)
const options = [
  { label: 'TRL-20490', value: 'TRL-20490' },
  { label: 'TRL-20491', value: 'TRL-20491' },
]
</script>

<style scoped>
.append-action-demo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.append-action-button {
  display: flex;
  padding: 0;
  color: inherit;
  cursor: pointer;
  border: 0;
  background: transparent;
}

.append-action-button svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}
</style>
