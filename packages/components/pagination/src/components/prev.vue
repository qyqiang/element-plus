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
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <g clip-path="url(#clip0_11356_6847)">
          <path
            d="M10.694 16L4.35603 9.65333C3.91994 9.21519 3.67512 8.62218 3.67512 8.004C3.67512 7.38582 3.91994 6.79281 4.35603 6.35467L10.7014 0L12.1134 1.414L5.76803 7.768C5.70554 7.83051 5.67044 7.91528 5.67044 8.00367C5.67044 8.09206 5.70554 8.17682 5.76803 8.23933L12.1054 14.586L10.694 16Z"
          />
        </g>
        <defs>
          <clipPath id="clip0_11356_6847">
            <rect width="16" height="16" fill="white" />
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
