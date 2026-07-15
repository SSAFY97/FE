<template>
  <div class="overflow-hidden rounded-2xl bg-main shadow-soft">
    <PostListItem v-for="post in posts" :key="post.id" :post="post" />
    <p v-if="!posts.length" class="py-12 text-center text-sm text-muted">
      게시글이 없습니다.
    </p>
  </div>
</template>

<script setup>
import PostListItem from '@/components/molecules/PostListItem.vue'

defineProps({
  posts: { type: Array, default: () => [] },
})
</script>
