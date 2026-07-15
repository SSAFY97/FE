import { http } from './http.js'

/**
 * @typedef {import('@/types/location.js').LocationListItem} LocationListItem
 * @typedef {import('@/types/location.js').LocationDetail} LocationDetail
 */

/** @param {unknown} data */
function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray(data.items)) {
    return data.items
  }
  return []
}

/** @param {Record<string, unknown>} item */
function mapLocation(item) {
  const firstimage = String(item.image_url || item.firstimage || '')
  const firstimage2 = String(item.firstimage2 || firstimage || '')
  return {
    id: String(item.id ?? item.contentid ?? ''),
    contentid: String(item.contentid ?? item.id ?? ''),
    contenttypeid: String(item.content_type_id ?? item.contenttypeid ?? ''),
    title: String(item.title ?? ''),
    addr1: String(item.address ?? item.addr1 ?? ''),
    addr2: String(item.addr2 ?? ''),
    tel: String(item.tel ?? ''),
    mapx: String(item.longitude ?? item.mapx ?? ''),
    mapy: String(item.latitude ?? item.mapy ?? ''),
    firstimage: firstimage || firstimage2,
    firstimage2: firstimage2 || firstimage,
    createdtime: String(item.createdtime ?? item.created_at ?? ''),
    modifiedtime: String(item.updated_at ?? item.modifiedtime ?? ''),
    category: item.category != null ? String(item.category) : undefined,
  }
}

export const locationApi = {
  /**
   * @param {{ category?: string, size?: number }} [params]
   * @returns {Promise<LocationListItem[]>}
   */
  async list(params = {}) {
    const qs = new URLSearchParams()
    if (params.category && params.category !== '전체') {
      qs.set('category', params.category)
    }
    qs.set('size', String(params.size ?? 10000))
    const query = qs.toString()
    const data = await http.get(`/locations${query ? `?${query}` : ''}`)
    return unwrapList(data).map(mapLocation)
  },

  /**
   * @param {string|number} id
   * @returns {Promise<LocationDetail>}
   */
  async get(id) {
    const data = await http.get(`/locations/${id}`)
    return mapLocation(data || {})
  },
}
