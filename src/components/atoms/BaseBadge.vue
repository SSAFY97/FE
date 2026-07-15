<template>
  <span
    class="inline-flex items-center rounded-lg px-2 py-0.5 text-xs"
    :class="toneClass"
  >
    <slot />
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tone: { type: String, default: 'soft' },
})

const toneClass = computed(() => {
  const map = {
    soft: 'bg-accent-soft text-accent',
    muted: 'bg-main text-muted',
    hot: 'bg-warm text-warm-ink',
  }
  return map[props.tone] || map.soft
})
</script>
