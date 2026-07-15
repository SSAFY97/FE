import { locationApi } from '@/api/locationApi'
import { TOUR_CATEGORIES, SEOUL_CITY_HALL } from '@/constants/tourism'
import { haversineKm } from '@/utils/hash'

/** @type {import('@/types/location.js').LocationListItem[] | null} */
let cache = null
/** @type {Promise<import('@/types/location.js').LocationListItem[]> | null} */
let loading = null

async function loadAll() {
  if (cache) return cache
  if (!loading) {
    loading = locationApi.list().then((items) => {
      cache = items
      loading = null
      return items
    })
  }
  return loading
}

function typeIdForCategory(category) {
  return TOUR_CATEGORIES.find((c) => c.key === category)?.contentTypeId
}

/**
 * tourismApi — uses GET /api/locations with client-side filter/sort.
 */
export const tourismApi = {
  async getByCategory(category) {
    const items = await loadAll()
    const typeId = typeIdForCategory(category)
    if (!typeId) return items
    return items.filter((item) => String(item.contenttypeid) === String(typeId))
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
      items = [...(await loadAll())]
    } else {
      items = await this.getByCategory(category)
    }

    const q = query.trim().toLowerCase()
    if (q) {
      items = items.filter(
        (item) =>
          (item.title || '').toLowerCase().includes(q) ||
          (item.addr1 || '').toLowerCase().includes(q),
      )
    }

    const sorted = [...items]
    if (sort === 'name') {
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
