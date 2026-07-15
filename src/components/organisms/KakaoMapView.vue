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
  /** 지도 클릭으로 출발지 지정 */
  pickOrigin: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['pick-origin'])

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
/** @type {((e: any) => void) | null} */
let clickHandler = null

function toLatLng(point) {
  return new mapsApi.LatLng(point.lat, point.lng)
}

function clearOverlays() {
  if (startMarker) {
    mapsApi.event.removeListener(startMarker, 'dragend', onStartDragEnd)
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

function onStartDragEnd() {
  if (!startMarker) return
  const latLng = startMarker.getPosition()
  emit('pick-origin', { lat: latLng.getLat(), lng: latLng.getLng() })
}

function relayout() {
  if (!map) return
  map.relayout()
  if (props.path?.length > 1) {
    const bounds = new mapsApi.LatLngBounds()
    props.path.forEach((p) => bounds.extend(toLatLng(p)))
    if (props.end) bounds.extend(toLatLng(props.end))
    if (props.start) bounds.extend(toLatLng(props.start))
    map.setBounds(bounds)
  } else if (props.start) {
    map.setCenter(toLatLng(props.start))
  } else if (props.center) {
    map.setCenter(toLatLng(props.center))
  }
}

function renderOverlays() {
  if (!map || !mapsApi) return

  clearOverlays()

  // 출발 마커는 신뢰된 좌표(start)가 있을 때만 — center(서울시청)로 대체하지 않음
  if (props.start?.lat != null && props.start?.lng != null) {
    startMarker = new mapsApi.Marker({
      position: toLatLng(props.start),
      map,
      title: '출발',
      draggable: true,
    })
    mapsApi.event.addListener(startMarker, 'dragend', onStartDragEnd)
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
    if (props.start) bounds.extend(toLatLng(props.start))
    map.setBounds(bounds)
  } else if (props.start) {
    map.setCenter(toLatLng(props.start))
  }
}

function bindClick() {
  if (!map || !mapsApi) return
  if (clickHandler) {
    mapsApi.event.removeListener(map, 'click', clickHandler)
    clickHandler = null
  }
  if (!props.pickOrigin) return
  clickHandler = (mouseEvent) => {
    const latLng = mouseEvent.latLng
    emit('pick-origin', { lat: latLng.getLat(), lng: latLng.getLng() })
  }
  mapsApi.event.addListener(map, 'click', clickHandler)
}

function errorMessage(err) {
  const msg = String(err?.message || err || '')
  if (msg.includes('VITE_KAKAO_MAP_KEY')) {
    return '카카오맵 키가 설정되지 않았습니다. .env의 VITE_KAKAO_MAP_KEY를 확인하세요.'
  }
  if (/Unauthorized|401|403|도메인|domain|KAKAO_SDK_LOAD_FAILED/i.test(msg)) {
    return '카카오맵 인증 실패. JavaScript 키와 도메인 등록을 확인하세요.'
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
      center: toLatLng(props.start || center),
      level: 5,
    })
    statusMessage.value = ''
    renderOverlays()
    bindClick()

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
  if (map && mapsApi && clickHandler) {
    mapsApi.event.removeListener(map, 'click', clickHandler)
  }
  clearOverlays()
  map = null
})

watch(
  () => [props.center, props.start, props.end, props.path],
  () => {
    if (!map) return
    if (!props.path?.length && (props.start || props.center)) {
      map.setCenter(toLatLng(props.start || props.center))
    }
    renderOverlays()
  },
  { deep: true },
)

watch(
  () => props.pickOrigin,
  () => bindClick(),
)
</script>
