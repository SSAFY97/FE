<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <div class="mb-6">
      <h1 class="text-2xl text-ink">관광정보</h1>
      <p class="mt-1 text-sm text-muted">서울의 여행지를 카테고리별로 둘러보세요</p>
    </div>

    <FilterToolbar
      v-model:query="query"
      v-model:category="category"
      v-model:sort="sort"
      :category-options="categoryOptions"
      :sort-options="TOUR_SORT_OPTIONS"
      search-placeholder="장소명 또는 주소 검색"
      @search="load"
    />

    <p class="mb-4 mt-5 text-xs text-muted">
      {{ loading ? '불러오는 중…' : `${displayItems.length}곳 표시` }}
      <span v-if="sort === 'distance'"> · 거리순 (위치 권한 기준)</span>
    </p>

    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="n in 8"
        :key="n"
        class="h-56 animate-pulse rounded-2xl bg-white/70"
      />
    </div>
    <TourGrid v-else :items="displayItems" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import FilterToolbar from '@/components/organisms/FilterToolbar.vue'
import TourGrid from '@/components/organisms/TourGrid.vue'
import { TOUR_CATEGORIES, TOUR_SORT_OPTIONS } from '@/constants/tourism'
import { tourismApi } from '@/services/tourismApi'
import { useGeolocation } from '@/composables/useGeolocation'

const query = ref('')
const category = ref('전체')
const sort = ref('latest')
const items = ref([])
const loading = ref(false)
const { position, ready, requestLocation } = useGeolocation()

const categoryOptions = [
  { value: '전체', label: '전체' },
  ...TOUR_CATEGORIES.map((c) => ({ value: c.key, label: c.label })),
]

const displayItems = computed(() => items.value.slice(0, 80))

async function load() {
  loading.value = true
  if (sort.value === 'distance') requestLocation()
  try {
    items.value = await tourismApi.search({
      category: category.value,
      query: query.value,
      sort: sort.value,
      userPos: position.value,
    })
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

watch(ready, (v) => {
  if (v && sort.value === 'distance') load()
})

onMounted(load)
</script>
