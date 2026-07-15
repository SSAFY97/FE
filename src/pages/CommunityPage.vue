<template>
  <PageShell>
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl text-ink">커뮤니티</h1>
        <p class="mt-1 text-sm text-muted">익명으로 여행 이야기를 나눠보세요</p>
      </div>
      <BaseButton :tag="RouterLink" to="/community/write">
        글쓰기
      </BaseButton>
    </div>

    <FilterToolbar
      v-model:query="query"
      v-model:sort="sort"
      :show-category="false"
      :sort-options="POST_SORT_OPTIONS"
      search-placeholder="제목, 작성자, 내용 검색"
      @search="load"
    />

    <div class="mt-5">
      <div v-if="loading" class="space-y-3">
        <div
          v-for="n in 5"
          :key="n"
          class="h-16 animate-pulse rounded-2xl bg-main"
        />
      </div>
      <StateMessage
        v-else-if="error"
        tone="error"
        title="불러오지 못했습니다"
        :description="error"
        action-label="다시 시도"
        @action="load"
      />
      <PostList v-else :posts="posts" />
    </div>
  </PageShell>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageShell from '@/components/molecules/PageShell.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import FilterToolbar from '@/components/organisms/FilterToolbar.vue'
import PostList from '@/components/organisms/PostList.vue'
import { POST_SORT_OPTIONS } from '@/constants/tourism'
import { postApi } from '@/services/postApi'

const query = ref('')
const sort = ref('latest')
const posts = ref([])
const loading = ref(false)
const error = ref('')

async function load() {
  loading.value = true
  error.value = ''
  try {
    posts.value = await postApi.list({
      query: query.value,
      sort: sort.value,
    })
  } catch {
    posts.value = []
    error.value = '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
