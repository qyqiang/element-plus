<template>
  <div class='footer-text'>
    <div class="count">{{ total }} items</div>
    <div class="time" v-if="updateTime">Last Updated {{ updateTime }}</div>
  </div>
</template>

<script setup lang="ts" name="tableText">
defineProps({ total: Number, updateTime: String })
</script>

