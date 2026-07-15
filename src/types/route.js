/**
 * @typedef {{ lat: number, lng: number }} RoutePoint
 *
 * @typedef {Object} RoutePlace
 * @property {string} name
 * @property {number} latitude
 * @property {number} longitude
 *
 * @typedef {Object} PedestrianRouteRequest
 * @property {RoutePlace} origin
 * @property {RoutePlace} destination
 *
 * @typedef {Object} PedestrianRoute
 * @property {RoutePlace} origin
 * @property {RoutePlace} destination
 * @property {number} [straightLineDistanceMeters]
 * @property {number} distanceMeters
 * @property {number} durationSeconds
 * @property {RoutePoint[]} path
 */

export {}
