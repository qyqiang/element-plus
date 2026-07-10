<script setup lang="ts">
import { useData } from 'vitepress'
import VPNavbarSearch from './navbar/vp-search.vue'
import VPNavbarMenu from './navbar/vp-menu.vue'
import VPNavbarThemeToggler from './navbar/vp-theme-toggler.vue'
import VPNavbarHamburger from './navbar/vp-hamburger.vue'

defineProps<{
  fullScreen: boolean
}>()

defineEmits(['toggle'])

const { theme } = useData()
</script>

<template>
<!--  <div class="navbar-wrapper">-->
<!--    <div class="header-container">-->
<!--      <div class="content">-->
<!--&lt;!&ndash;        <VPNavbarSearch class="search" :options="theme.agolia" multilang />&ndash;&gt;-->
<!--&lt;!&ndash;        <VPNavbarMenu class="menu" />&ndash;&gt;-->
<!--&lt;!&ndash;        <VPNavbarThemeToggler class="theme-toggler" />&ndash;&gt;-->
<!--&lt;!&ndash;        <VPNavbarHamburger&ndash;&gt;-->
<!--&lt;!&ndash;          :active="fullScreen"&ndash;&gt;-->
<!--&lt;!&ndash;          class="hamburger"&ndash;&gt;-->
<!--&lt;!&ndash;          @click="$emit('toggle')"&ndash;&gt;-->
<!--&lt;!&ndash;        />&ndash;&gt;-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>

<style scoped lang="scss">
.logo-container {
  display: flex;
  align-items: center;
  height: var(--header-height);
  > a {
    height: 28px;
    width: 128px;
  }
  .logo {
    position: relative;
    height: 100%;
  }
}
.dark {
  .logo {
    filter: drop-shadow(2px 2px 6px #409eff);
  }
}
</style>
