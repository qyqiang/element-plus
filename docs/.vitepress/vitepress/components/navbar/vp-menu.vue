<script setup lang="ts">
import VPMenuLink from './vp-menu-link.vue'

const navs = [
  {
    text: 'Component',
    link: '/en-US/component/overview',
    activeMatch: '/component/',
  },
]
</script>

<template>
  <nav v-if="navs" class="navbar-menu">
    <VPMenuLink v-for="(item, key) in navs" :key="key" :item="item" />
  </nav>
</template>
