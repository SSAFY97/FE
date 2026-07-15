/**
 * @typedef {{ lat: number, lng: number }} RoutePoint
 *
 * @typedef {Object} PedestrianRouteRequest
 * @property {number} startX
 * @property {number} startY
 * @property {number} endX
 * @property {number} endY
 * @property {string} [startName]
 * @property {string} [endName]
 *
 * @typedef {Object} PedestrianRoute
 * @property {number} totalDistance - meters
 * @property {number} totalTime - seconds
 * @property {RoutePoint[]} points
 */

export {}
