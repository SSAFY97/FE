import { postApi as boardApi } from '@/api/postApi'

const LIKES_KEY = 'seouleum_liked_ids'

function readLikedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function writeLikedIds(set) {
  localStorage.setItem(LIKES_KEY, JSON.stringify([...set]))
}

/**
 * @param {import('@/types/post.js').BoardPost} board
 * @param {Set<string>} likedIds
 */
function toUiPost(board, likedIds = readLikedIds()) {
  const id = String(board.board_id ?? board.id)
  return {
    id,
    title: board.board_title,
    content: board.board_content,
    author: board.board_writer,
    createdAt: board.created_at,
    views: Number(board.board_views) || 0,
    likes: Number(board.board_likes) || 0,
    liked: likedIds.has(id),
    password: board.board_password,
  }
}

/**
 * postApi — UI-facing service over /api/posts (BE schema mapped).
 */
export const postApi = {
  async list({ query = '', sort = 'latest' } = {}) {
    const likedIds = readLikedIds()
    let posts = (await boardApi.list()).map((b) => toUiPost(b, likedIds))
    const q = query.trim().toLowerCase()
    if (q) {
      posts = posts.filter(
        (p) =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.author || '').toLowerCase().includes(q) ||
          (p.content || '').toLowerCase().includes(q),
      )
    }
    const sorted = [...posts]
    if (sort === 'views') sorted.sort((a, b) => b.views - a.views)
    else if (sort === 'likes') sorted.sort((a, b) => b.likes - a.likes)
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    return sorted
  },

  async hot(limit = 3) {
    const likedIds = readLikedIds()
    const posts = (await boardApi.list())
      .map((b) => toUiPost(b, likedIds))
      .sort((a, b) => b.likes - a.likes)
    return posts.slice(0, limit)
  },

  async get(id, { incrementView = true } = {}) {
    // BE increments views on GET; `incrementView` kept for call-site compat.
    void incrementView
    const board = await boardApi.get(id)
    if (!board) throw new Error('NOT_FOUND')
    return toUiPost(board)
  },

  async create({ title, content, author, password }) {
    if (!title?.trim() || !content?.trim() || !author?.trim() || !password) {
      throw new Error('VALIDATION')
    }
    const created = await boardApi.create({
      board_title: title.trim(),
      board_content: content.trim(),
      board_writer: author.trim(),
      board_password: password,
    })
    return toUiPost(created)
  },

  async update(id, { title, content, password, author }) {
    const updated = await boardApi.update({
      board_id: id,
      board_title: title.trim(),
      board_content: content.trim(),
      board_writer: (author || '').trim(),
      board_password: password,
    })
    return toUiPost(updated)
  },

  async remove(id, { password }) {
    await boardApi.remove(id, { password })
    const liked = readLikedIds()
    liked.delete(String(id))
    writeLikedIds(liked)
    return { ok: true }
  },

  async like(id) {
    const result = await boardApi.like(id)
    const liked = readLikedIds()
    const key = String(result.post_id ?? id)
    liked.add(key)
    writeLikedIds(liked)
    return {
      id: key,
      likes: Number(result.like_count) || 0,
      liked: true,
    }
  },
}
