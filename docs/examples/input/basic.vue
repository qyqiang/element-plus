<template>
  <el-input
    v-model="input"
    style="width: 240px"
    placeholder="Please input"
    :float-label="false"
    type="textarea"
    :rows="3"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const input = ref('')
</script>
