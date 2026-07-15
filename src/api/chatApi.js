import { http } from './http.js'

/**
 * @typedef {import('@/types/chat.js').ChatRequest} ChatRequest
 * @typedef {import('@/types/chat.js').ChatData} ChatData
 */

export const chatApi = {
  /**
   * @param {ChatRequest} body
   * @returns {Promise<ChatData>}
   */
  async send({ message }) {
    return http.post('/chat', { message })
  },
}
