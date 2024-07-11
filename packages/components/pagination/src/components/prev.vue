<template>
  <button
    type="button"
    class="btn-prev"
    :disabled="internalDisabled"
    :aria-label="prevText || t('el.pagination.prev')"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="prevText">{{ prevText }}</span>
    <el-icon v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="12"
        viewBox="0 0 13 12"
      >
        <g clip-path="url(#clip0_1345_15785)">
          <path
            d="M8.52052 12L3.76702 7.24C3.43996 6.91139 3.25634 6.46663 3.25634 6.003C3.25634 5.53937 3.43996 5.09461 3.76702 4.766L8.52602 0L9.58502 1.0605L4.82602 5.826C4.77916 5.87288 4.75283 5.93646 4.75283 6.00275C4.75283 6.06904 4.77916 6.13262 4.82602 6.1795L9.57902 10.9395L8.52052 12Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_1345_15785">
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
import { paginationPrevEmits, paginationPrevProps } from './prev'

defineOptions({
  name: 'ElPaginationPrev',
})

const props = defineProps(paginationPrevProps)
defineEmits(paginationPrevEmits)

const { t } = useLocale()

const internalDisabled = computed(
  () => props.disabled || props.currentPage <= 1
)
</script>
