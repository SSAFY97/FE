<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-ink/30 p-4 backdrop-blur-[2px]"
    @click.self="$emit('close')"
  >
    <div
      class="animate-scale-in w-full rounded-2xl bg-main p-5 shadow-soft"
      :class="sizeClass"
      role="dialog"
      aria-modal="true"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg text-ink">{{ title }}</h3>
        <button
          type="button"
          class="rounded-lg p-1 text-muted hover:bg-surface"
          aria-label="닫기"
          @click="$emit('close')"
        >
          <BaseIcon name="x" :size="18" />
        </button>
      </div>
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
  },
})

defineEmits(['close'])

const sizeClass = computed(() => {
  const map = {
    md: 'max-w-md',
    lg: 'max-w-lg',
  }
  return map[props.size] || map.md
})
</script>
