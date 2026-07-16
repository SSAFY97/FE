<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[60] flex items-center justify-center bg-scrim p-4 backdrop-blur-[2px]"
    @click.self="emit('close')"
  >
    <div
      class="animate-scale-in flex max-h-[min(90vh,40rem)] w-full flex-col rounded-2xl border border-line bg-main shadow-soft"
      :class="sizeClass"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="titleId"
    >
      <div class="flex shrink-0 items-start justify-between gap-3 px-5 pt-5">
        <h3
          :id="titleId"
          class="min-w-0 flex-1 text-lg font-bold leading-snug text-ink"
        >
          {{ title }}
        </h3>
        <button
          type="button"
          class="rounded-lg p-1 text-muted transition hover:bg-accent-soft"
          aria-label="닫기"
          @click="emit('close')"
        >
          <BaseIcon name="x" :size="18" />
        </button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-5 pt-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onUnmounted } from 'vue'
import BaseIcon from './BaseIcon.vue'

const props = defineProps({
  open: Boolean,
  title: { type: String, default: '' },
  size: {
    type: String,
    default: 'md',
  },
})

const emit = defineEmits(['close'])

const titleId = `base-modal-title-${Math.random().toString(36).slice(2, 9)}`

const sizeClass = computed(() => {
  const map = {
    md: 'max-w-md',
    lg: 'max-w-lg',
  }
  return map[props.size] || map.md
})

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

function lockBodyScroll(lock) {
  if (typeof document === 'undefined') return
  document.body.style.overflow = lock ? 'hidden' : ''
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      window.addEventListener('keydown', onKeydown)
      lockBodyScroll(true)
    } else {
      window.removeEventListener('keydown', onKeydown)
      lockBodyScroll(false)
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  lockBodyScroll(false)
})
</script>
