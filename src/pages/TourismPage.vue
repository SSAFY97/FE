<template>
  <PageShell>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-ink">관광정보</h1>
      <p class="mt-1 text-sm text-muted">서울의 여행지를 카테고리별로 둘러보세요</p>
    </div>

    <FilterToolbar
      v-model:query="query"
      v-model:category="category"
      v-model:sort="sort"
      :category-options="categoryOptions"
      :sort-options="TOUR_SORT_OPTIONS"
      search-placeholder="장소명 또는 주소 검색"
      @search="onSearch"
    />

    <p
      v-if="sort === 'distance' && geoBanner"
      class="mt-4 rounded-xl bg-accent-soft px-3 py-2 text-xs text-ink"
    >
      {{ geoBanner }}
    </p>

    <p class="mb-4 mt-5 text-xs text-muted">
      {{
        loading
          ? '불러오는 중…'
          : totalCount
            ? `${rangeStart}–${rangeEnd} · 전체 ${totalCount}`
            : '0곳 표시'
      }}
      <span v-if="sort === 'distance'"> · 거리순</span>
    </p>

    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="n in 8"
        :key="n"
        class="h-56 animate-pulse rounded-2xl bg-main"
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
    <StateMessage
      v-else-if="!displayItems.length"
      title="표시할 장소가 없습니다"
      description="검색어나 카테고리를 바꿔 보세요."
    />
    <template v-else>
      <TourGrid :items="displayItems" @select="openTourDetail" />

      <nav
        v-if="totalPages > 1"
        class="mt-8 flex flex-wrap items-center justify-center gap-1"
        aria-label="페이지네이션"
      >
        <BaseButton
          variant="ghost"
          :disabled="page <= 1"
          aria-label="이전 페이지"
          @click="goToPage(page - 1)"
        >
          이전
        </BaseButton>
        <button
          v-for="p in pageNumbers"
          :key="p"
          type="button"
          class="min-w-9 rounded-xl px-3 py-2 text-sm transition"
          :class="
            p === page
              ? 'bg-accent font-bold text-main shadow-soft'
              : p === '…'
                ? 'cursor-default text-muted'
                : 'text-ink hover:bg-accent-soft'
          "
          :disabled="p === '…'"
          :aria-current="p === page ? 'page' : undefined"
          @click="p !== '…' && goToPage(p)"
        >
          {{ p }}
        </button>
        <BaseButton
          variant="ghost"
          :disabled="page >= totalPages"
          aria-label="다음 페이지"
          @click="goToPage(page + 1)"
        >
          다음
        </BaseButton>
      </nav>
    </template>

    <TourDetailModal
      :open="tourModalOpen"
      :location-id="selectedLocationId"
      @close="closeTourDetail"
    />
  </PageShell>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import PageShell from '@/components/molecules/PageShell.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'
import FilterToolbar from '@/components/organisms/FilterToolbar.vue'
import TourGrid from '@/components/organisms/TourGrid.vue'
import TourDetailModal from '@/components/organisms/TourDetailModal.vue'
import { TOUR_CATEGORIES, TOUR_SORT_OPTIONS } from '@/constants/tourism'
import { tourismApi } from '@/services/tourismApi'
import { useGeolocation } from '@/composables/useGeolocation'

const PAGE_SIZE = 20

const query = ref('')
const category = ref('전체')
const sort = ref('latest')
const items = ref([])
const loading = ref(false)
const error = ref('')
const page = ref(1)
const tourModalOpen = ref(false)
const selectedLocationId = ref('')
const { position, ready, status, requestLocation, positionOrDefault } =
  useGeolocation()

const categoryOptions = [
  { value: '전체', label: '전체' },
  ...TOUR_CATEGORIES.map((c) => ({ value: c.key, label: c.label })),
]

const totalCount = computed(() => items.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)))

const displayItems = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  return items.value.slice(start, start + PAGE_SIZE)
})

const rangeStart = computed(() =>
  totalCount.value ? (page.value - 1) * PAGE_SIZE + 1 : 0,
)
const rangeEnd = computed(() =>
  Math.min(page.value * PAGE_SIZE, totalCount.value),
)

/** @type {import('vue').ComputedRef<(number | '…')[]>} */
const pageNumbers = computed(() => {
  const total = totalPages.value
  const current = page.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = new Set([1, total, current, current - 1, current + 1])
  if (current <= 3) {
    pages.add(2)
    pages.add(3)
    pages.add(4)
  }
  if (current >= total - 2) {
    pages.add(total - 1)
    pages.add(total - 2)
    pages.add(total - 3)
  }
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  /** @type {(number | '…')[]} */
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…')
    result.push(sorted[i])
  }
  return result
})

const geoBanner = computed(() => {
  if (sort.value !== 'distance') return ''
  if (status.value === 'pending') return '위치 확인 중…'
  if (status.value === 'denied' || status.value === 'unsupported') {
    return '위치 권한을 쓸 수 없어 시청 기준으로 정렬합니다'
  }
  return ''
})

function openTourDetail(id) {
  selectedLocationId.value = id
  tourModalOpen.value = true
}

function closeTourDetail() {
  tourModalOpen.value = false
  selectedLocationId.value = ''
}

function goToPage(p) {
  if (typeof p !== 'number') return
  const next = Math.min(Math.max(1, p), totalPages.value)
  page.value = next
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onSearch() {
  page.value = 1
  load()
}

async function load() {
  loading.value = true
  error.value = ''
  if (sort.value === 'distance') requestLocation()
  try {
    items.value = await tourismApi.search({
      category: category.value,
      query: query.value,
      sort: sort.value,
      userPos: positionOrDefault(),
    })
    if (page.value > totalPages.value) page.value = 1
  } catch {
    items.value = []
    error.value = '관광 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

watch(ready, (v) => {
  if (v && sort.value === 'distance') load()
})

onMounted(load)
</script>
