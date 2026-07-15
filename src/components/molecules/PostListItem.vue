<template>
  <RouterLink
    :to="`/community/${post.id}`"
    class="flex items-center justify-between gap-4 rounded-2xl bg-main px-4 py-5 shadow-soft transition hover:brightness-[1.02]"
  >
    <div class="min-w-0 flex-1">
      <p class="truncate text-sm text-ink">{{ post.title }}</p>
      <p class="mt-1.5 text-xs text-muted">
        {{ post.author }} · {{ formatDate(post.createdAt) }}
      </p>
    </div>
    <div class="flex shrink-0 items-center gap-3 text-xs text-muted">
      <span class="inline-flex items-center gap-1">
        <BaseIcon name="heart" :size="14" />
        {{ post.likes }}
      </span>
      <span class="inline-flex items-center gap-1">
        <BaseIcon name="eye" :size="14" />
        {{ post.views }}
      </span>
    </div>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import BaseIcon from '@/components/atoms/BaseIcon.vue'
import { formatDate } from '@/utils/hash'

defineProps({
  post: { type: Object, required: true },
})
</script>
