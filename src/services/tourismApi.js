import { TOUR_CATEGORIES, SEOUL_CITY_HALL } from '@/constants/tourism'
import { haversineKm } from '@/utils/hash'

const cache = new Map()

function fileForCategory(category) {
  const found = TOUR_CATEGORIES.find((c) => c.key === category)
  return found?.file ?? TOUR_CATEGORIES[0].file
}

async function loadCategory(category) {
  if (cache.has(category)) return cache.get(category)
  const file = fileForCategory(category)
  const res = await fetch(`/data/${file}`)
  if (!res.ok) throw new Error(`Failed to load tourism data: ${category}`)
  const json = await res.json()
  const items = Array.isArray(json.items) ? json.items : []
  cache.set(category, items)
  return items
}

/**
 * tourismApi — local JSON via fetch (ready to swap for real API).
 */
export const tourismApi = {
  async getByCategory(category) {
    return loadCategory(category)
  },

  async getPreview(category, limit = 8) {
    const items = await loadCategory(category)
    return items
      .filter((item) => item.firstimage)
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
      items = await loadCategory(category)
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
        (b.modifiedtime || '').localeCompare(a.modifiedtime || ''),
      )
    }

    return sorted
  },
}
