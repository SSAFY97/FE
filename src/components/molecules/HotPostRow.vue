<template>
  <RouterLink
    :to="`/community/${post.id}`"
    class="flex items-center gap-4 rounded-2xl bg-main px-4 py-3 shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-accent-soft"
  >
    <BaseBadge tone="hot">HOT</BaseBadge>
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm text-ink">{{ post.title }}</p>
      <p class="mt-0.5 text-xs text-muted">{{ post.author }}</p>
    </div>
    <div class="flex shrink-0 gap-3 text-xs text-muted">
      <span class="inline-flex items-center gap-1">
        <BaseIcon name="eye" :size="14" />
        {{ post.views }}
      </span>
      <span class="inline-flex items-center gap-1">
        <BaseIcon name="heart" :size="14" />
        {{ post.likes }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import BaseBadge from '@/components/atoms/BaseBadge.vue'
import BaseIcon from '@/components/atoms/BaseIcon.vue'

defineProps({
  post: { type: Object, required: true },
})
</script>
