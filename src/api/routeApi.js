import { http } from './http.js'

/**
 * @typedef {import('@/types/route.js').PedestrianRouteRequest} PedestrianRouteRequest
 * @typedef {import('@/types/route.js').PedestrianRoute} PedestrianRoute
 * @typedef {import('@/types/route.js').RoutePlace} RoutePlace
 * @typedef {import('@/types/route.js').RoutePoint} RoutePoint
 */

/**
 * @param {unknown} raw
 * @returns {RoutePoint[]}
 */
function mapPath(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((p) => {
      if (!p || typeof p !== 'object') return null
      const lat = Number(p.latitude ?? p.lat ?? p.y)
      const lng = Number(p.longitude ?? p.lng ?? p.x)
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
      return { lat, lng }
    })
    .filter(Boolean)
}

/**
 * @param {unknown} raw
 * @returns {RoutePlace}
 */
function mapPlace(raw) {
  if (!raw || typeof raw !== 'object') {
    return { name: '', latitude: 0, longitude: 0 }
  }
  return {
    name: String(raw.name ?? ''),
    latitude: Number(raw.latitude ?? 0),
    longitude: Number(raw.longitude ?? 0),
  }
}

/**
 * @param {Record<string, unknown>} data
 * @returns {PedestrianRoute}
 */
function mapRoute(data) {
  return {
    origin: mapPlace(data.origin),
    destination: mapPlace(data.destination),
    straightLineDistanceMeters: Number(
      data.straight_line_distance_meters ?? data.straightLineDistanceMeters ?? 0,
    ),
    distanceMeters: Number(data.distance_meters ?? data.distanceMeters ?? 0),
    durationSeconds: Number(data.duration_seconds ?? data.durationSeconds ?? 0),
    path: mapPath(data.path),
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
