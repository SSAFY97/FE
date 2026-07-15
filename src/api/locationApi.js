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
  const image = item.image_url || item.firstimage || item.firstimage2 || ''
  return {
    id: String(item.id ?? item.contentid ?? ''),
    contentid: String(item.contentid ?? item.id ?? ''),
    contenttypeid: String(item.content_type_id ?? item.contenttypeid ?? ''),
    title: item.title ?? '',
    addr1: item.address ?? item.addr1 ?? '',
    addr2: item.addr2 ?? '',
    tel: item.tel ?? '',
    mapx: String(item.longitude ?? item.mapx ?? ''),
    mapy: String(item.latitude ?? item.mapy ?? ''),
    firstimage: image,
    firstimage2: item.firstimage2 || image,
    createdtime: item.createdtime ?? '',
    modifiedtime: item.updated_at ?? item.modifiedtime ?? '',
    category: item.category,
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
