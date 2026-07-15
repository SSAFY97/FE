<template>
  <div
    class="relative h-full min-h-[20rem] w-full overflow-hidden rounded-2xl border border-line/70 bg-main"
  >
    <div ref="mapEl" class="absolute inset-0 h-full w-full" />
    <div
      v-if="statusMessage"
      class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-main/70 px-4 text-center text-sm text-muted"
    >
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { loadKakaoMaps } from '@/composables/useKakaoMaps'
import { SEOUL_CITY_HALL } from '@/constants/tourism'

const props = defineProps({
  /** @type {{ lat: number, lng: number }} */
  center: {
    type: Object,
    default: () => ({ ...SEOUL_CITY_HALL }),
  },
  /** @type {{ lat: number, lng: number } | null} */
  start: {
    type: Object,
    default: null,
  },
  /** @type {{ lat: number, lng: number } | null} */
  end: {
    type: Object,
    default: null,
  },
  /** @type {{ lat: number, lng: number }[]} */
  path: {
    type: Array,
    default: () => [],
  },
})

const mapEl = ref(null)
const statusMessage = ref('지도를 불러오는 중…')

/** @type {any} */
let map = null
/** @type {any} */
let startMarker = null
/** @type {any} */
let endMarker = null
/** @type {any} */
let polyline = null
/** @type {any} */
let mapsApi = null
/** @type {ResizeObserver | null} */
let resizeObserver = null

function toLatLng(point) {
  return new mapsApi.LatLng(point.lat, point.lng)
}

function clearOverlays() {
  if (startMarker) {
    startMarker.setMap(null)
    startMarker = null
  }
  if (endMarker) {
    endMarker.setMap(null)
    endMarker = null
  }
  if (polyline) {
    polyline.setMap(null)
    polyline = null
  }
}

function relayout() {
  if (!map) return
  map.relayout()
  if (props.path?.length > 1) {
    const bounds = new mapsApi.LatLngBounds()
    props.path.forEach((p) => bounds.extend(toLatLng(p)))
    if (props.end) bounds.extend(toLatLng(props.end))
    const startPoint = props.start || props.center
    if (startPoint) bounds.extend(toLatLng(startPoint))
    map.setBounds(bounds)
  } else {
    const center = props.center || SEOUL_CITY_HALL
    map.setCenter(toLatLng(center))
  }
}

function renderOverlays() {
  if (!map || !mapsApi) return

  clearOverlays()

  const startPoint = props.start || props.center
  if (startPoint?.lat != null && startPoint?.lng != null) {
    startMarker = new mapsApi.Marker({
      position: toLatLng(startPoint),
      map,
      title: '출발',
    })
  }

  if (props.end?.lat != null && props.end?.lng != null) {
    endMarker = new mapsApi.Marker({
      position: toLatLng(props.end),
      map,
      title: '도착',
    })
  }

  if (props.path?.length > 1) {
    const linePath = props.path.map((p) => toLatLng(p))
    polyline = new mapsApi.Polyline({
      path: linePath,
      strokeWeight: 5,
      strokeColor: '#6a66a8',
      strokeOpacity: 0.85,
      strokeStyle: 'solid',
    })
    polyline.setMap(map)

    const bounds = new mapsApi.LatLngBounds()
    linePath.forEach((latLng) => bounds.extend(latLng))
    if (props.end) bounds.extend(toLatLng(props.end))
    if (startPoint) bounds.extend(toLatLng(startPoint))
    map.setBounds(bounds)
  } else if (startPoint) {
    map.setCenter(toLatLng(startPoint))
  }
}

function errorMessage(err) {
  const msg = String(err?.message || err || '')
  if (msg.includes('VITE_KAKAO_MAP_KEY')) {
    return '카카오맵 키가 설정되지 않았습니다. .env의 VITE_KAKAO_MAP_KEY를 확인하세요.'
  }
  if (/Unauthorized|401|403|도메인|domain|KAKAO_SDK_LOAD_FAILED/i.test(msg)) {
    return '카카오맵 인증 실패(401). JavaScript 키인지, Web 플랫폼에 http://localhost:5173 도메인을 등록했는지 확인하세요.'
  }
  return '지도를 불러오지 못했습니다. 키·도메인 등록 후 Vite를 재시작해 보세요.'
}

async function initMap() {
  try {
    mapsApi = await loadKakaoMaps()
    await nextTick()
    if (!mapEl.value) return

    const center = props.center || SEOUL_CITY_HALL
    map = new mapsApi.Map(mapEl.value, {
      center: toLatLng(center),
      level: 5,
    })
    statusMessage.value = ''
    renderOverlays()

    await nextTick()
    relayout()
    requestAnimationFrame(() => relayout())

    if (typeof ResizeObserver !== 'undefined' && mapEl.value) {
      resizeObserver = new ResizeObserver(() => relayout())
      resizeObserver.observe(mapEl.value.parentElement || mapEl.value)
    }
  } catch (err) {
    console.error('[KakaoMap]', err)
    statusMessage.value = errorMessage(err)
  }
}

onMounted(() => {
  initMap()
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  clearOverlays()
  map = null
})

watch(
  () => [props.center, props.start, props.end, props.path],
  () => {
    if (!map) return
    if (!props.path?.length && props.center) {
      map.setCenter(toLatLng(props.center))
    }
    renderOverlays()
  },
  { deep: true },
)
</script>
