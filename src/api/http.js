/**
 * @typedef {import('@/types/common.js').ApiResponse} ApiResponse
 */

/**
 * 브라우저는 항상 상대경로 `/api` 로 요청합니다.
 * - 로컬: vite.config.js 가 VITE_API_TARGET 으로 proxy
 * - Netlify: netlify.toml 이 /api → 백엔드로 proxy
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
    const code = Number(payload.response)
    if (!Number.isFinite(code) || code < 200 || code >= 300) {
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
  delete: (path, body) => request('DELETE', path, body),
}
