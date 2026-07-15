<template>
  <button
    type="button"
    class="group flex h-60 w-full flex-col overflow-hidden rounded-2xl bg-main text-left shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    @click="$emit('select', id)"
  >
    <div class="h-36 w-full shrink-0 overflow-hidden bg-accent-soft">
      <BaseImage
        :src="image"
        :alt="title"
        class="block h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
      />
    </div>
    <div
      class="flex h-24 w-full shrink-0 flex-col justify-center gap-1 overflow-hidden px-3"
    >
      <h3 class="truncate text-sm leading-5 text-ink">{{ title }}</h3>
      <p class="truncate text-xs leading-4 text-muted">
        {{ address || '주소 정보 없음' }}
      </p>
    </div>
  </button>
</template>

<script setup>
import BaseImage from '@/components/atoms/BaseImage.vue'

defineProps({
  id: { type: [String, Number], required: true },
  title: { type: String, default: '' },
  address: { type: String, default: '' },
  image: { type: String, default: '' },
})

defineEmits(['select'])
</script>
