import { http } from './http.js'

/**
 * @typedef {import('@/types/route.js').PedestrianRouteRequest} PedestrianRouteRequest
 * @typedef {import('@/types/route.js').PedestrianRoute} PedestrianRoute
 * @typedef {import('@/types/route.js').RoutePoint} RoutePoint
 */

/**
 * @param {unknown} raw
 * @returns {RoutePoint[]}
 */
function mapPoints(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((p) => {
      if (!p || typeof p !== 'object') return null
      const lat = Number(p.lat ?? p.latitude ?? p.y)
      const lng = Number(p.lng ?? p.longitude ?? p.x)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
      return { lat, lng }
    })
    .filter(Boolean)
}

/**
 * @param {Record<string, unknown>} data
 * @returns {PedestrianRoute}
 */
function mapRoute(data) {
  return {
    totalDistance: Number(data.totalDistance ?? data.total_distance ?? 0),
    totalTime: Number(data.totalTime ?? data.total_time ?? 0),
    points: mapPoints(data.points),
  }
}

export const routeApi = {
  /**
   * @param {PedestrianRouteRequest} body
   * @returns {Promise<PedestrianRoute>}
   */
  async getPedestrian(body) {
    const data = await http.post('/routes/pedestrian', body)
    return mapRoute(data || {})
  },
}
