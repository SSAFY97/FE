import { ref } from 'vue'
import { SEOUL_CITY_HALL } from '@/constants/tourism'

const position = ref({ ...SEOUL_CITY_HALL })
const ready = ref(false)
let requested = false

export function useGeolocation() {
  function requestLocation() {
    if (requested) return
    requested = true
    if (!navigator.geolocation) {
      ready.value = true
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        position.value = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        ready.value = true
      },
      () => {
        position.value = { ...SEOUL_CITY_HALL }
        ready.value = true
      },
      { timeout: 5000 },
    )
  }

  return { position, ready, requestLocation }
}
