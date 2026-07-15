<template>
  <div class="flex flex-col gap-3">
    <PostListItem v-for="post in posts" :key="post.id" :post="post" />
    <StateMessage
      v-if="!posts.length"
      title="게시글이 없습니다"
      description="첫 여행 이야기를 남겨 보세요."
    />
  </div>
</template>

<script setup>
import PostListItem from '@/components/molecules/PostListItem.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'

defineProps({
  posts: { type: Array, default: () => [] },
})
</script>
