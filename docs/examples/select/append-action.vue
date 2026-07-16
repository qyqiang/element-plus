<template>
  <div class="append-action-demo">
    <el-select v-model="value" placeholder="Trailer Alias" style="width: 320px">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
      <template #append>
        <el-button class="icon-button" text @click="actionCount++">
          te
        </el-button>
      </template>
    </el-select>
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
