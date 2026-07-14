<template>
  <section class="mx-auto w-full max-w-5xl px-4">
    <h2 class="mb-4 text-center text-xl text-ink">🔥HOT🔥</h2>
    <div class="flex flex-col gap-3">
      <HotPostRow v-for="post in posts" :key="post.id" :post="post" />
      <p v-if="!posts.length" class="py-6 text-center text-sm text-muted">
        아직 HOT 게시글이 없습니다.
      </p>
    </div>
  </section>
</template>

<script setup>
import HotPostRow from '@/components/molecules/HotPostRow.vue'

defineProps({
  posts: { type: Array, default: () => [] },
})
</script>
