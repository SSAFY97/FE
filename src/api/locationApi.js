import { http } from './http.js'

/**
 * @typedef {import('@/types/location.js').LocationListItem} LocationListItem
 * @typedef {import('@/types/location.js').LocationDetail} LocationDetail
 */

export const locationApi = {
  /**
   * @returns {Promise<LocationListItem[]>}
   */
  async list() {
    const data = await http.get('/locations')
    return Array.isArray(data) ? data : []
  },

  /**
   * @param {string|number} id
   * @returns {Promise<LocationDetail>}
   */
  async get(id) {
    return http.get(`/locations/${id}`)
  },
}
