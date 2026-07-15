<template>
  <div class="py-12 text-center">
    <p class="text-sm" :class="tone === 'error' ? 'text-danger' : 'text-ink'">
      {{ title }}
    </p>
    <p v-if="description" class="mt-2 text-sm text-muted">
      {{ description }}
    </p>
    <BaseButton
      v-if="actionLabel"
      class="mt-4"
      :variant="tone === 'error' ? 'secondary' : 'ghost'"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </BaseButton>
  </div>
</template>

<script setup>
import BaseButton from '@/components/atoms/BaseButton.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  tone: {
    type: String,
    default: 'empty',
  },
})

defineEmits(['action'])
</script>
