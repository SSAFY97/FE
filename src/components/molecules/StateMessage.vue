<template>
  <div class="py-12 text-center">
    <p class="text-sm" :class="tone === 'error' ? 'text-danger' : 'text-ink'">
      {{ title }}
    </p>
    <p v-if="description" class="mt-2 text-sm text-muted">
      {{ description }}
    </p>
    <div
      v-if="actionLabel || secondaryActionLabel"
      class="mt-4 flex flex-wrap items-center justify-center gap-2"
    >
      <BaseButton
        v-if="actionLabel"
        :variant="tone === 'error' ? 'secondary' : 'ghost'"
        @click="$emit('action')"
      >
        {{ actionLabel }}
      </BaseButton>
      <BaseButton
        v-if="secondaryActionLabel"
        variant="ghost"
        @click="$emit('secondary-action')"
      >
        {{ secondaryActionLabel }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/atoms/BaseButton.vue'

defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionLabel: { type: String, default: '' },
  secondaryActionLabel: { type: String, default: '' },
  tone: {
    type: String,
    default: 'empty',
  },
})

defineEmits(['action', 'secondary-action'])
</script>
