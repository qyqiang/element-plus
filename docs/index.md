---
title: 'A Vue 3 UI Framework'
lang: en-US
page: true
---

<script setup lang="ts">
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

onMounted(() => {
  window.location.replace(withBase('/en-US/component/button'))
})
</script>

Redirecting to Button component...
