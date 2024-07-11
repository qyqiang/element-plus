<template>
  <div :ref="composedDialogRef" :class="dialogKls" :style="style" tabindex="-1">
    <header
      ref="headerRef"
      :style="{ backgroundColor: headerBackgroundColor }"
      :class="[ns.e('header'), { 'show-close': showClose }]"
    >
      <slot name="header">
        <span role="heading" :aria-level="ariaLevel" :class="ns.e('title')">
          {{ title }}
        </span>
      </slot>
      <button
        v-if="showClose"
        :aria-label="t('el.dialog.close')"
        :class="ns.e('headerbtn')"
        type="button"
        @click="$emit('close')"
      >
        <el-icon :class="ns.e('close')" size="24px">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="24"
            viewBox="0 0 25 24"
          >
            <path
              d="M19.2068 6.70685L17.7928 5.29285L12.4998 10.5858L7.20685 5.29285L5.79285 6.70685L11.0858 11.9998L5.79285 17.2928L7.20685 18.7068L12.4998 13.4138L17.7928 18.7068L19.2068 17.2928L13.9138 11.9998L19.2068 6.70685Z"
            />
          </svg>
        </el-icon>
      </button>
    </header>
    <div :id="bodyId" :class="ns.e('body')">
      <slot />
    </div>
    <footer v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue'
import { ElIcon } from '@element-plus/components/icon'
import { FOCUS_TRAP_INJECTION_KEY } from '@element-plus/components/focus-trap'
import { useDraggable, useLocale } from '@element-plus/hooks'
import { composeRefs } from '@element-plus/utils'
import { dialogInjectionKey } from './constants'
import { dialogContentEmits, dialogContentProps } from './dialog-content'

const { t } = useLocale()

defineOptions({ name: 'ElDialogContent' })
const props = defineProps(dialogContentProps)
defineEmits(dialogContentEmits)

const { dialogRef, headerRef, bodyId, ns, style } = inject(dialogInjectionKey)!
const { focusTrapRef } = inject(FOCUS_TRAP_INJECTION_KEY)!

const dialogKls = computed(() => [
  ns.b(),
  ns.is('fullscreen', props.fullscreen),
  ns.is('draggable', props.draggable),
  ns.is('align-center', props.alignCenter),
  { [ns.m('center')]: props.center },
])

const composedDialogRef = composeRefs(focusTrapRef, dialogRef)

const draggable = computed(() => props.draggable)
const overflow = computed(() => props.overflow)
useDraggable(dialogRef, headerRef, draggable, overflow)
</script>
