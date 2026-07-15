<template>
  <PageShell>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-ink">길찾기</h1>
      <p class="mt-1 text-sm text-muted">
        현위치에서 관광 장소까지 도보 경로를 안내합니다
      </p>
    </div>

    <SearchField
      v-model="query"
      placeholder="도착지 장소명 또는 주소 검색"
      @search="onSearch"
    />

    <p
      v-if="loading"
      class="mt-4 text-xs text-muted"
    >
      경로를 찾는 중…
    </p>

    <p
      v-if="geoBanner"
      class="mt-4 rounded-xl bg-accent-soft px-3 py-2 text-xs text-ink"
    >
      {{ geoBanner }}
    </p>

    <div
      v-if="destination || routeSummary"
      class="mt-4 rounded-xl border border-line/70 bg-main px-4 py-3 text-sm text-ink"
    >
      <p v-if="destination">
        <span class="text-muted">도착</span>
        {{ destination.title }}
        <span v-if="destination.addr1" class="text-muted">
          · {{ destination.addr1 }}
        </span>
      </p>
      <p v-if="routeSummary" class="mt-1 text-muted">
        {{ routeSummary }}
      </p>
    </div>

    <StateMessage
      v-if="error"
      class="mt-4"
      tone="error"
      :title="error"
      :description="errorDetail"
      action-label="다시 시도"
      @action="onSearch"
    />

    <div class="mt-5 h-[min(70vh,36rem)]">
      <KakaoMapView
        :center="mapCenter"
        :start="mapStart"
        :end="mapEnd"
        :path="routePath"
      />
    </div>
  </PageShell>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import PageShell from '@/components/molecules/PageShell.vue'
import SearchField from '@/components/molecules/SearchField.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'
import KakaoMapView from '@/components/organisms/KakaoMapView.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { tourismApi } from '@/services/tourismApi'
import { routeApi } from '@/api/routeApi'
import { SEOUL_CITY_HALL } from '@/constants/tourism'

const query = ref('')
const loading = ref(false)
const error = ref('')
const errorDetail = ref('')
/** @type {import('vue').Ref<import('@/types/location.js').LocationListItem | null>} */
const destination = ref(null)
/** @type {import('vue').Ref<{ lat: number, lng: number }[]>} */
const routePath = ref([])
const totalDistance = ref(0)
const totalTime = ref(0)

const { position, ready, status, requestLocation } = useGeolocation()

const mapCenter = computed(() =>
  ready.value ? { ...position.value } : { ...SEOUL_CITY_HALL },
)

const mapStart = computed(() =>
  ready.value ? { ...position.value } : { ...SEOUL_CITY_HALL },
)

const mapEnd = computed(() => {
  if (!destination.value) return null
  const lat = parseFloat(destination.value.mapy)
  const lng = parseFloat(destination.value.mapx)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
})

const geoBanner = computed(() => {
  if (status.value === 'pending') return '위치를 확인하는 중…'
  if (status.value === 'denied') {
    return '위치 권한이 없어 서울시청을 출발지로 사용합니다.'
  }
  if (status.value === 'unsupported') {
    return '이 브라우저는 위치 정보를 지원하지 않아 서울시청을 출발지로 사용합니다.'
  }
  return ''
})

const routeSummary = computed(() => {
  if (!routePath.value.length) return ''
  const km =
    totalDistance.value >= 1000
      ? `${(totalDistance.value / 1000).toFixed(1)}km`
      : `${Math.round(totalDistance.value)}m`
  const minutes = Math.max(1, Math.round(totalTime.value / 60))
  return `도보 약 ${km} · ${minutes}분`
})

onMounted(() => {
  requestLocation()
})

function clearRoute() {
  destination.value = null
  routePath.value = []
  totalDistance.value = 0
  totalTime.value = 0
}

async function onSearch() {
  const q = query.value.trim()
  if (!q) {
    error.value = '도착지를 입력해 주세요'
    errorDetail.value = ''
    return
  }

  loading.value = true
  error.value = ''
  errorDetail.value = ''
  clearRoute()

  try {
    const userPos = ready.value ? position.value : SEOUL_CITY_HALL
    const items = await tourismApi.search({
      query: q,
      sort: 'distance',
      userPos,
    })

    const place = items.find((item) => {
      const lat = parseFloat(item.mapy)
      const lng = parseFloat(item.mapx)
      return Number.isFinite(lat) && Number.isFinite(lng)
    })

    if (!place) {
      error.value = '검색 결과가 없습니다'
      errorDetail.value = '장소명이나 주소를 바꿔 보세요.'
      return
    }

    destination.value = place
    const endLat = parseFloat(place.mapy)
    const endLng = parseFloat(place.mapx)

    const route = await routeApi.getPedestrian({
      startX: userPos.lng,
      startY: userPos.lat,
      endX: endLng,
      endY: endLat,
      startName: '현위치',
      endName: place.title || '도착지',
    })

    if (!route.points?.length) {
      error.value = '경로를 찾지 못했습니다'
      errorDetail.value = '다른 도착지를 검색해 보세요.'
      return
    }

    routePath.value = route.points
    totalDistance.value = route.totalDistance
    totalTime.value = route.totalTime
  } catch (err) {
    error.value = '길찾기에 실패했습니다'
    errorDetail.value = err?.message || '잠시 후 다시 시도해 주세요.'
  } finally {
    loading.value = false
  }
}
</script>
