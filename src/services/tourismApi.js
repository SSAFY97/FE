import { locationApi } from '@/api/locationApi'
import { TOUR_CATEGORIES, SEOUL_CITY_HALL } from '@/constants/tourism'
import { haversineKm } from '@/utils/hash'

/** @type {Map<string, import('@/types/location.js').LocationListItem[]>} */
const cache = new Map()
/** @type {Map<string, Promise<import('@/types/location.js').LocationListItem[]>>} */
const loading = new Map()

async function loadCategory(category) {
  const key = category || '전체'
  if (cache.has(key)) return cache.get(key)
  if (!loading.has(key)) {
    loading.set(
      key,
      locationApi
        .list({ category: key === '전체' ? undefined : key })
        .then((items) => {
          cache.set(key, items)
          loading.delete(key)
          return items
        })
        .catch((err) => {
          loading.delete(key)
          throw err
        }),
    )
  }
  return loading.get(key)
}

/**
 * tourismApi — uses GET /api/locations with BE category filter + client sort.
 */
export const tourismApi = {
  async getByCategory(category) {
    return loadCategory(category)
  },

  async getPreview(category, limit = 8) {
    const items = await this.getByCategory(category)
    return items
      .filter((item) => item.firstimage || item.firstimage2)
      .slice(0, limit)
  },

  async search({
    category = '전체',
    query = '',
    sort = 'latest',
    userPos = SEOUL_CITY_HALL,
  } = {}) {
    let items = []
    if (category === '전체') {
      const batches = await Promise.all(
        TOUR_CATEGORIES.map((c) => loadCategory(c.key)),
      )
      items = batches.flat()
    } else {
      items = [...(await loadCategory(category))]
    }

    const q = query.trim().toLowerCase()
    if (q) {
      items = items.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.addr1 || '').toLowerCase().includes(q),
      )
    }

    let sorted = [...items]
    if (sort === 'name') {
      const startsWithWord = (t) => /^[가-힣a-zA-Z0-9]/.test((t || '').trim())
      sorted = sorted.filter((item) => startsWithWord(item.title))
      sorted.sort((a, b) => (a.title || '').localeCompare(b.title || '', 'ko'))
    } else if (sort === 'distance') {
      sorted.sort((a, b) => {
        const da = haversineKm(
          userPos.lat,
          userPos.lng,
          parseFloat(a.mapy) || 0,
          parseFloat(a.mapx) || 0,
        )
        const db = haversineKm(
          userPos.lat,
          userPos.lng,
          parseFloat(b.mapy) || 0,
          parseFloat(b.mapx) || 0,
        )
        return da - db
      })
    } else {
      sorted.sort((a, b) =>
        (b.modifiedtime || b.createdtime || '').localeCompare(
          a.modifiedtime || a.createdtime || '',
        ),
      )
    }

    return sorted
  },
}
