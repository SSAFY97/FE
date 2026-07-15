<template>
  <section class="mx-auto w-full max-w-5xl px-4">
    <div class="mb-4 flex items-center justify-center gap-2">
      <BaseBadge tone="hot">HOT</BaseBadge>
      <h2 class="font-display text-xl text-ink">인기 게시글</h2>
    </div>
    <div class="flex flex-col gap-3">
      <HotPostRow v-for="post in posts" :key="post.id" :post="post" />
      <p v-if="!posts.length" class="py-6 text-center text-sm text-muted">
        아직 인기 게시글이 없습니다.
      </p>
    </div>
  </section>
</template>

<script setup>
import HotPostRow from '@/components/molecules/HotPostRow.vue'
import BaseBadge from '@/components/atoms/BaseBadge.vue'

defineProps({
  posts: { type: Array, default: () => [] },
})
</script>
