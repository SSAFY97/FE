import { ref } from 'vue'
import { SEOUL_CITY_HALL } from '@/constants/tourism'

/** @typedef {'idle' | 'pending' | 'granted' | 'denied' | 'unsupported'} GeoStatus */

/** @type {import('vue').Ref<{ lat: number, lng: number } | null>} */
const position = ref(null)
const ready = ref(false)
/** @type {import('vue').Ref<GeoStatus>} */
const status = ref('idle')

/** @type {Promise<{ lat: number, lng: number } | null> | null} */
let pending = null

/**
 * @param {{ force?: boolean }} [options]
 * @returns {Promise<{ lat: number, lng: number } | null>}
 */
function ensureLocation(options = {}) {
  const { force = false } = options

  if (!force && status.value === 'granted' && position.value) {
    return Promise.resolve({ ...position.value })
  }
  if (pending) return pending

  if (!navigator.geolocation) {
    status.value = 'unsupported'
    ready.value = true
    position.value = null
    return Promise.resolve(null)
  }

  status.value = 'pending'

  pending = new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        position.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        status.value = 'granted'
        ready.value = true
        pending = null
        resolve({ ...position.value })
      },
      () => {
        status.value = 'denied'
        ready.value = true
        // 실패해도 이전 좌표가 있으면 유지
        pending = null
        resolve(position.value ? { ...position.value } : null)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    )
  })

  return pending
}

/**
 * @param {{ lat: number, lng: number }} point
 */
function setPosition(point) {
  position.value = { lat: point.lat, lng: point.lng }
  status.value = 'granted'
  ready.value = true
}

function positionOrDefault() {
  return position.value ? { ...position.value } : { ...SEOUL_CITY_HALL }
}

export function useGeolocation() {
  function requestLocation() {
    void ensureLocation({ force: false })
  }

  return {
    position,
    ready,
    status,
    requestLocation,
    ensureLocation,
    setPosition,
    /** @deprecated use setPosition */
    setManualPosition: setPosition,
    positionOrDefault,
  }
}
