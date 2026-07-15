/**
 * Kakao Maps JS SDK loader (autoload=false).
 * @see https://apis.map.kakao.com/web/guide/
 */

let loadPromise = null

/**
 * @param {HTMLScriptElement} script
 * @returns {Promise<void>}
 */
function waitForScript(script) {
  return new Promise((resolve, reject) => {
    if (script.dataset.loaded === 'true' || window.kakao?.maps) {
      resolve()
      return
    }
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('KAKAO_SDK_LOAD_FAILED')),
      { once: true },
    )
  })
}

/**
 * @returns {Promise<typeof window.kakao.maps>}
 */
function resolveMapsApi() {
  return new Promise((resolve, reject) => {
    if (!window.kakao?.maps) {
      reject(new Error('KAKAO_SDK_UNAVAILABLE'))
      return
    }
    window.kakao.maps.load(() => resolve(window.kakao.maps))
  })
}

/**
 * @returns {Promise<typeof window.kakao.maps>}
 */
export function loadKakaoMaps() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('WINDOW_UNAVAILABLE'))
  }

  if (window.kakao?.maps) {
    return resolveMapsApi()
  }

  if (loadPromise) return loadPromise

  const appKey = String(import.meta.env.VITE_KAKAO_MAP_KEY || '').trim()
  if (!appKey) {
    return Promise.reject(new Error('VITE_KAKAO_MAP_KEY is missing'))
  }

  loadPromise = (async () => {
    try {
      let script = document.querySelector('script[data-kakao-maps]')
      if (!script) {
        script = document.createElement('script')
        // http(localhost)에서도 https SDK를 써야 401/혼합콘텐츠 이슈를 줄일 수 있음
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`
        script.async = true
        script.dataset.kakaoMaps = 'true'
        script.addEventListener(
          'load',
          () => {
            script.dataset.loaded = 'true'
          },
          { once: true },
        )
        document.head.appendChild(script)
      }

      await waitForScript(script)
      return await resolveMapsApi()
    } catch (err) {
      loadPromise = null
      throw err
    }
  })()

  return loadPromise
}

export function useKakaoMaps() {
  return { loadKakaoMaps }
}
