import { ref } from 'vue'
import { SEOUL_CITY_HALL } from '@/constants/tourism'

/** @typedef {'idle' | 'pending' | 'granted' | 'denied' | 'unsupported'} GeoStatus */

const position = ref({ ...SEOUL_CITY_HALL })
const ready = ref(false)
/** @type {import('vue').Ref<GeoStatus>} */
const status = ref('idle')
let requested = false

export function useGeolocation() {
  function requestLocation() {
    if (requested) return
    requested = true

    if (!navigator.geolocation) {
      status.value = 'unsupported'
      position.value = { ...SEOUL_CITY_HALL }
      ready.value = true
      return
    }

    status.value = 'pending'
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        position.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        status.value = 'granted'
        ready.value = true
      },
      () => {
        position.value = { ...SEOUL_CITY_HALL }
        status.value = 'denied'
        ready.value = true
      },
      { timeout: 5000 },
    )
  }

  return { position, ready, status, requestLocation }
}
