import { chatApi as remoteChatApi } from '@/api/chatApi'

/**
 * chatApi — UI-facing wrapper over POST /api/chat.
 */
export const chatApi = {
  /**
   * @param {{ message: string, history?: unknown[] }} params
   */
  async send({ message }) {
    if (!message?.trim()) throw new Error('VALIDATION')
    const data = await remoteChatApi.send({ message: message.trim() })
    return {
      reply: data?.message ?? '',
    }
  },
}
