<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <div class="mb-6 flex items-end justify-between gap-4">
      <div>
        <h1 class="text-2xl text-ink">커뮤니티</h1>
        <p class="mt-1 text-sm text-muted">익명으로 여행 이야기를 나눠보세요</p>
      </div>
      <RouterLink
        to="/community/write"
        class="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm text-white shadow-soft transition hover:brightness-110"
      >
        글쓰기
      </RouterLink>
    </div>

    <FilterToolbar
      v-model:query="query"
      v-model:category="category"
      v-model:sort="sort"
      :category-options="categoryOptions"
      :sort-options="POST_SORT_OPTIONS"
      search-placeholder="제목, 작성자, 내용 검색"
      @search="load"
    />

    <div class="mt-5">
      <div v-if="loading" class="space-y-3">
        <div
          v-for="n in 5"
          :key="n"
          class="h-16 animate-pulse rounded-2xl bg-white/70"
        />
      </div>
      <PostList v-else :posts="posts" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import FilterToolbar from '@/components/organisms/FilterToolbar.vue'
import PostList from '@/components/organisms/PostList.vue'
import { TOUR_CATEGORIES, POST_SORT_OPTIONS } from '@/constants/tourism'
import { postApi } from '@/services/postApi'

const query = ref('')
const category = ref('전체')
const sort = ref('latest')
const posts = ref([])
const loading = ref(false)

const categoryOptions = [
  { value: '전체', label: '전체' },
  ...TOUR_CATEGORIES.map((c) => ({ value: c.key, label: c.label })),
]

async function load() {
  loading.value = true
  try {
    posts.value = await postApi.list({
      query: query.value,
      sort: sort.value,
    })
  } catch {
    posts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>
