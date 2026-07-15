import { postApi as boardApi } from '@/api/postApi'

const LIKES_KEY = 'localhub_liked_ids'

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

function assertPassword(board, password) {
  if (String(board.board_password) !== String(password)) {
    throw new Error('FORBIDDEN')
  }
}

/**
 * postApi — UI-facing service over /api/posts.
 */
export const postApi = {
  async list({ query = '', sort = 'latest' } = {}) {
    const likedIds = readLikedIds()
    let posts = (await boardApi.list()).map((b) => toUiPost(b, likedIds))
    const q = query.trim().toLowerCase()
    if (q) {
      posts = posts.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
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
    const board = await boardApi.get(id)
    if (!board) throw new Error('NOT_FOUND')
    if (incrementView) {
      const next = {
        board_id: Number(board.board_id ?? board.id),
        board_title: board.board_title,
        board_content: board.board_content,
        board_writer: board.board_writer,
        board_password: board.board_password,
        board_views: (Number(board.board_views) || 0) + 1,
        board_likes: Number(board.board_likes) || 0,
        created_at: board.created_at,
      }
      const updated = await boardApi.update(next)
      return toUiPost(updated)
    }
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

  async update(id, { title, content, password }) {
    const board = await boardApi.get(id)
    if (!board) throw new Error('NOT_FOUND')
    assertPassword(board, password)
    const updated = await boardApi.update({
      board_id: Number(board.board_id ?? board.id),
      board_title: title.trim(),
      board_content: content.trim(),
      board_writer: board.board_writer,
      board_password: board.board_password,
      board_views: Number(board.board_views) || 0,
      board_likes: Number(board.board_likes) || 0,
      created_at: board.created_at,
    })
    return toUiPost(updated)
  },

  async remove(id, { password }) {
    const board = await boardApi.get(id)
    if (!board) throw new Error('NOT_FOUND')
    assertPassword(board, password)
    await boardApi.remove(id)
    const liked = readLikedIds()
    liked.delete(String(id))
    writeLikedIds(liked)
    return { ok: true }
  },

  async like(id) {
    const board = await boardApi.get(id)
    if (!board) throw new Error('NOT_FOUND')
    const liked = readLikedIds()
    const key = String(id)
    let likes = Number(board.board_likes) || 0
    if (liked.has(key)) {
      liked.delete(key)
      likes = Math.max(0, likes - 1)
    } else {
      liked.add(key)
      likes += 1
    }
    writeLikedIds(liked)
    const updated = await boardApi.update({
      board_id: Number(board.board_id ?? board.id),
      board_title: board.board_title,
      board_content: board.board_content,
      board_writer: board.board_writer,
      board_password: board.board_password,
      board_views: Number(board.board_views) || 0,
      board_likes: likes,
      created_at: board.created_at,
    })
    return toUiPost(updated, liked)
  },

  async verifyPassword(id, password) {
    const board = await boardApi.get(id)
    if (!board) throw new Error('NOT_FOUND')
    return String(board.board_password) === String(password)
  },
}
