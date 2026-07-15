import { http } from './http.js'

/**
 * @typedef {import('@/types/post.js').BoardPost} BoardPost
 * @typedef {import('@/types/post.js').BoardPostWriteBody} BoardPostWriteBody
 */

/** @param {unknown} data */
function unwrapList(data) {
  if (Array.isArray(data)) return data
  if (data && typeof data === 'object' && Array.isArray(data.items)) {
    return data.items
  }
  return []
}

/** @param {Record<string, unknown>} p */
function mapFromBe(p) {
  if (!p || typeof p !== 'object') return p
  return {
    id: p.id ?? p.board_id,
    board_id: p.board_id ?? p.id,
    board_title: p.board_title ?? p.title ?? '',
    board_content: p.board_content ?? p.content ?? '',
    board_writer: p.board_writer ?? p.writer ?? '',
    board_password: p.board_password ?? p.password ?? '',
    board_views: p.board_views ?? p.view_count ?? 0,
    board_likes: p.board_likes ?? p.like_count ?? 0,
    created_at: p.created_at ?? '',
  }
}

/** @param {BoardPostWriteBody & Record<string, unknown>} body */
function mapToBeWrite(body) {
  return {
    title: body.board_title ?? body.title ?? '',
    content: body.board_content ?? body.content ?? '',
    writer: body.board_writer ?? body.writer ?? '',
    password: body.board_password ?? body.password ?? '',
  }
}

export const postApi = {
  /**
   * @returns {Promise<BoardPost[]>}
   */
  async list() {
    const data = await http.get('/posts?size=100')
    return unwrapList(data).map(mapFromBe)
  },

  /**
   * @param {string|number} id
   * @returns {Promise<BoardPost>}
   */
  async get(id) {
    const data = await http.get(`/posts/${id}`)
    return mapFromBe(data || {})
  },

  /**
   * @param {BoardPostWriteBody} body
   * @returns {Promise<BoardPost>}
   */
  async create(body) {
    const data = await http.post('/posts', mapToBeWrite(body))
    return mapFromBe(data || {})
  },

  /**
   * @param {BoardPostWriteBody & { board_id?: number|string }} body
   * @returns {Promise<BoardPost>}
   */
  async update(body) {
    const id = body.board_id ?? body.id
    const data = await http.put(`/posts/${id}`, {
      title: body.board_title ?? body.title ?? '',
      content: body.board_content ?? body.content ?? '',
      writer: body.board_writer ?? body.writer ?? '',
      password: body.board_password ?? body.password ?? '',
    })
    return mapFromBe(data || {})
  },

  /**
   * @param {string|number} id
   * @param {{ password?: string }} [opts]
   * @returns {Promise<*>}
   */
  async remove(id, opts = {}) {
    return http.delete(`/posts/${id}`, { password: opts.password ?? '' })
  },

  /**
   * @param {string|number} id
   * @returns {Promise<{ post_id: number, like_count: number }>}
   */
  async like(id) {
    const data = await http.post(`/posts/${id}/likes`)
    return {
      post_id: Number(data?.post_id ?? id),
      like_count: Number(data?.like_count ?? 0),
    }
  },
}
