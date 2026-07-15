/**
 * @typedef {import('@/types/common.js').ApiResponse} ApiResponse
 */

const BASE = '/api'

/**
 * @param {string} method
 * @param {string} path
 * @param {unknown} [body]
 * @returns {Promise<*>}
 */
export async function request(method, path, body) {
  const url = path.startsWith('http') ? path : `${BASE}${path}`
  /** @type {RequestInit} */
  const init = {
    method,
    headers: {
      Accept: 'application/json',
    },
  }
  if (body !== undefined) {
    init.headers = {
      ...init.headers,
      'Content-Type': 'application/json',
    }
    init.body = JSON.stringify(body)
  }

  const res = await fetch(url, init)
  let payload
  try {
    payload = await res.json()
  } catch {
    throw new Error(res.ok ? 'PARSE_ERROR' : `HTTP_${res.status}`)
  }

  if (!res.ok) {
    throw new Error(payload?.message || `HTTP_${res.status}`)
  }

  if (
    payload &&
    typeof payload === 'object' &&
    'response' in payload &&
    'data' in payload
  ) {
    if (payload.response !== 200) {
      throw new Error(payload.message || `API_${payload.response}`)
    }
    return payload.data
  }

  return payload
}

export const http = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
}
