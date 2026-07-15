<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50"
    :class="variantClass"
    v-bind="$attrs"
  >
    <span
      v-if="loading"
      class="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  type: {
    type: String,
    default: 'button',
  },
  tag: {
    type: String,
    default: 'button',
  },
  disabled: Boolean,
  loading: Boolean,
})

const variantClass = computed(() => {
  const map = {
    primary: 'bg-main text-ink hover:brightness-105 shadow-soft',
    secondary: 'bg-accent-soft text-ink hover:bg-main',
    ghost: 'bg-transparent text-ink hover:bg-accent-soft',
    danger: 'bg-danger text-ink hover:brightness-105',
  }
  return map[props.variant] || map.primary
})
</script>
