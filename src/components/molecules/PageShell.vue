<template>
  <div class="min-h-screen bg-subpage-radial pt-[4.25rem]">
    <div class="mx-auto px-4 py-8" :class="widthClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  width: {
    type: String,
    default: 'wide',
  },
})

const widthClass = computed(() => {
  const map = {
    wide: 'max-w-6xl',
    narrow: 'max-w-2xl',
  }
  return map[props.width] || map.wide
})
</script>
