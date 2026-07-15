<template>
  <PageShell>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-ink">길찾기</h1>
      <p class="mt-1 text-sm text-muted">
        현위치에서 관광 장소까지 도보 경로를 안내합니다
      </p>
    </div>

    <div class="rounded-2xl border border-line/70 bg-main p-3 shadow-soft">
      <SearchField
        v-model="query"
        placeholder="도착지 장소명 또는 주소 검색"
        @search="onSearch"
      />
    </div>

    <p v-if="loading" class="mt-4 text-xs text-muted">경로를 찾는 중…</p>
    <p v-else-if="status === 'pending'" class="mt-4 text-xs text-muted">
      현위치를 확인하는 중…
    </p>
    <p v-else-if="!position" class="mt-4 text-xs text-muted">
      현위치를 찾지 못했습니다. 지도를 클릭해 출발지를 지정하세요.
    </p>
    <p v-else class="mt-4 text-xs text-muted">
      출발: 현위치 · 지도 클릭으로 수정 가능
    </p>

    <div
      v-if="destination || routeSummary"
      class="mt-4 rounded-xl border border-line/70 bg-main px-4 py-3 text-sm text-ink"
    >
      <p>
        <span class="text-muted">출발</span>
        현위치
      </p>
      <p v-if="destination" class="mt-1">
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
      :secondary-action-label="tooFarError ? '다른 장소 찾아보기' : ''"
      @action="retry"
      @secondary-action="goTourism"
    />

    <div class="mt-5 h-[min(70vh,36rem)]">
      <KakaoMapView
        :center="mapCenter"
        :start="position"
        :end="mapEnd"
        :path="routePath"
        @pick-origin="onPickOrigin"
      />
    </div>
  </PageShell>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageShell from '@/components/molecules/PageShell.vue'
import SearchField from '@/components/molecules/SearchField.vue'
import StateMessage from '@/components/molecules/StateMessage.vue'
import KakaoMapView from '@/components/organisms/KakaoMapView.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { tourismApi } from '@/services/tourismApi'
import { routeApi } from '@/api/routeApi'
import { SEOUL_CITY_HALL } from '@/constants/tourism'

const route = useRoute()
const router = useRouter()
const query = ref('')
const loading = ref(false)
const error = ref('')
const errorDetail = ref('')
const tooFarError = ref(false)
/** @type {import('vue').Ref<import('@/types/location.js').LocationListItem | null>} */
const destination = ref(null)
/** @type {import('vue').Ref<{ lat: number, lng: number }[]>} */
const routePath = ref([])
const totalDistance = ref(0)
const totalTime = ref(0)
const appliedDeepLink = ref('')

const { position, status, ensureLocation, setPosition } = useGeolocation()

const mapCenter = computed(() =>
  position.value ? { ...position.value } : { ...SEOUL_CITY_HALL },
)

const mapEnd = computed(() => {
  if (!destination.value) return null
  const lat = parseFloat(destination.value.mapy)
  const lng = parseFloat(destination.value.mapx)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng }
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

/**
 * @returns {{ lat: number, lng: number, name: string } | null}
 */
function parseDeepLinkQuery() {
  const lat = parseFloat(String(route.query.lat ?? ''))
  const lng = parseFloat(String(route.query.lng ?? ''))
  const name = String(route.query.name ?? '').trim()
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
  return { lat, lng, name: name || '도착지' }
}

onMounted(() => {
  void ensureLocation({ force: true })
  void tryDeepLink()
})

watch(
  () => [route.query.lat, route.query.lng, route.query.name],
  () => {
    void tryDeepLink()
  },
)

/**
 * @param {{ lat: number, lng: number }} point
 */
function onPickOrigin(point) {
  setPosition(point)
  clearRoute()
  error.value = ''
  errorDetail.value = ''
  tooFarError.value = false
}

function goTourism() {
  router.push({ name: 'tourism' })
}

function clearRoute() {
  destination.value = null
  routePath.value = []
  totalDistance.value = 0
  totalTime.value = 0
}

function retry() {
  const deep = parseDeepLinkQuery()
  if (deep) {
    appliedDeepLink.value = ''
    void tryDeepLink()
    return
  }
  void onSearch()
}

async function tryDeepLink() {
  const deep = parseDeepLinkQuery()
  if (!deep) return

  const key = `${deep.lat},${deep.lng},${deep.name}`
  if (appliedDeepLink.value === key) return
  appliedDeepLink.value = key

  query.value = deep.name
  await requestPedestrianRoute({
    title: deep.name,
    mapx: String(deep.lng),
    mapy: String(deep.lat),
    contentid: '',
    contenttypeid: '',
  })
}

/**
 * @param {import('@/types/location.js').LocationListItem} place
 */
async function requestPedestrianRoute(place) {
  loading.value = true
  error.value = ''
  errorDetail.value = ''
  tooFarError.value = false
  clearRoute()

  try {
    if (!position.value) {
      await ensureLocation({ force: true })
    }

    const destLat = parseFloat(place.mapy)
    const destLng = parseFloat(place.mapx)
    if (!Number.isFinite(destLat) || !Number.isFinite(destLng)) {
      error.value = '좌표 정보가 없습니다'
      errorDetail.value = '다른 도착지를 검색해 보세요.'
      return
    }

    destination.value = place

    if (!position.value) {
      error.value = '출발지가 없습니다'
      errorDetail.value = '지도를 클릭해 출발지를 지정해 주세요.'
      return
    }

    const userPos = { lat: position.value.lat, lng: position.value.lng }
    const routeResult = await routeApi.getPedestrian({
      origin: {
        name: '현위치',
        latitude: userPos.lat,
        longitude: userPos.lng,
      },
      destination: {
        name: place.title || '도착지',
        latitude: destLat,
        longitude: destLng,
      },
    })

    if (!routeResult.path?.length) {
      error.value = '경로를 찾지 못했습니다'
      errorDetail.value = '다른 도착지를 검색해 보세요.'
      return
    }

    routePath.value = routeResult.path
    totalDistance.value = routeResult.distanceMeters
    totalTime.value = routeResult.durationSeconds
  } catch (err) {
    if (err?.status === 422) {
      const destName = place.title || '도착지'
      error.value = `${destName}까지는 너무 멀어요!`
      errorDetail.value = ''
      tooFarError.value = true
    } else {
      error.value = '길찾기에 실패했습니다'
      errorDetail.value = err?.message || '잠시 후 다시 시도해 주세요.'
    }
  } finally {
    loading.value = false
  }
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
  tooFarError.value = false
  clearRoute()
  appliedDeepLink.value = ''

  /** @type {import('@/types/location.js').LocationListItem | null} */
  let place = null

  try {
    if (!position.value) {
      await ensureLocation({ force: true })
    }

    if (!position.value) {
      error.value = '출발지가 없습니다'
      errorDetail.value = '지도를 클릭해 출발지를 지정해 주세요.'
      return
    }

    const userPos = { lat: position.value.lat, lng: position.value.lng }

    const items = await tourismApi.search({
      query: q,
      sort: 'distance',
      userPos,
    })

    place =
      items.find((item) => {
        const lat = parseFloat(item.mapy)
        const lng = parseFloat(item.mapx)
        return Number.isFinite(lat) && Number.isFinite(lng)
      }) || null

    if (!place) {
      error.value = '검색 결과가 없습니다'
      errorDetail.value = '장소명이나 주소를 바꿔 보세요.'
    }
  } catch (err) {
    error.value = '길찾기에 실패했습니다'
    errorDetail.value = err?.message || '잠시 후 다시 시도해 주세요.'
  } finally {
    loading.value = false
  }

  if (place) await requestPedestrianRoute(place)
}
</script>
