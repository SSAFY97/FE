import { http } from './http.js'

/**
 * @typedef {import('@/types/post.js').BoardPost} BoardPost
 * @typedef {import('@/types/post.js').BoardPostWriteBody} BoardPostWriteBody
 */

export const postApi = {
  /**
   * @returns {Promise<BoardPost[]>}
   */
  async list() {
    const data = await http.get('/posts')
    return Array.isArray(data) ? data : []
  },

  /**
   * @param {string|number} id
   * @returns {Promise<BoardPost>}
   */
  async get(id) {
    return http.get(`/posts/${id}`)
  },

  /**
   * @param {BoardPostWriteBody} body
   * @returns {Promise<BoardPost>}
   */
  async create(body) {
    return http.post('/posts', body)
  },

  /**
   * @param {BoardPostWriteBody} body
   * @returns {Promise<BoardPost>}
   */
  async update(body) {
    return http.put('/posts', body)
  },

  /**
   * @param {string|number} id
   * @returns {Promise<*>}
   */
  async remove(id) {
    return http.delete(`/posts/${id}`)
  },
}
