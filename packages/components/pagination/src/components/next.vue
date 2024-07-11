<template>
  <button
    type="button"
    class="btn-next"
    :disabled="internalDisabled"
    :aria-label="nextText || t('el.pagination.next')"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="nextText">{{ nextText }}</span>
    <el-icon v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="12"
        viewBox="0 0 13 12"
      >
        <g clip-path="url(#clip0_1345_15810)">
          <path
            d="M4.5635 12L9.317 7.24C9.64407 6.91139 9.82768 6.46663 9.82768 6.003C9.82768 5.53937 9.64407 5.09461 9.317 4.766L4.558 0L3.5 1.0605L8.259 5.826C8.30587 5.87288 8.3322 5.93646 8.3322 6.00275C8.3322 6.06904 8.30587 6.13262 8.259 6.1795L3.505 10.9395L4.5635 12Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_1345_15810">
            <rect width="12" height="12" transform="translate(0.5)" />
          </clipPath>
        </defs>
      </svg>
    </el-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useLocale } from '@element-plus/hooks'
import { ElIcon } from '@element-plus/components/icon'
import { paginationNextProps } from './next'

defineOptions({
  name: 'ElPaginationNext',
})

const props = defineProps(paginationNextProps)

defineEmits(['click'])

const { t } = useLocale()

const internalDisabled = computed(
  () =>
    props.disabled ||
    props.currentPage === props.pageCount ||
    props.pageCount === 0
)
</script>
