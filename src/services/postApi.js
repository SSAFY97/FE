import { hashPassword } from '@/utils/hash'

const STORAGE_KEY = 'localhub_posts'
const LIKES_KEY = 'localhub_liked_ids'

const seedPosts = [
  {
    id: 'seed-1',
    title: '한강공원 야경 추천 코스',
    content:
      '여의도 → 반포 → 뚝섬 순으로 가보세요. 해질 무렵에 출발하면 분위기가 최고입니다.',
    author: '서울나그네',
    passwordHash: '',
    createdAt: '2026-07-01T10:00:00.000Z',
    views: 312,
    likes: 48,
    comments: [
      {
        id: 'c1',
        author: '산책러',
        content: '반포 야경이 정말 좋더라고요!',
        createdAt: '2026-07-02T08:00:00.000Z',
      },
    ],
  },
  {
    id: 'seed-2',
    title: '북촌 한옥마을 데이트 후기',
    content: '오전 일찍 가면 한적해요. 카페골목도 꼭 들러보세요.',
    author: '주말탐험가',
    passwordHash: '',
    createdAt: '2026-07-05T14:30:00.000Z',
    views: 198,
    likes: 36,
    comments: [],
  },
  {
    id: 'seed-3',
    title: '남산타워 가는 법 총정리',
    content: '케이블카보다 순환버스가 대기 짧았어요. 날씨 좋은 날 추천!',
    author: '도시여행자',
    passwordHash: '',
    createdAt: '2026-07-08T09:15:00.000Z',
    views: 421,
    likes: 55,
    comments: [
      {
        id: 'c2',
        author: '초보여행',
        content: '도움 됐어요 감사합니다',
        createdAt: '2026-07-09T11:00:00.000Z',
      },
      {
        id: 'c3',
        author: '사진덕후',
        content: '석양 타임 필수',
        createdAt: '2026-07-10T19:00:00.000Z',
      },
    ],
  },
  {
    id: 'seed-4',
    title: '광장시장 먹거리 베스트 5',
    content: '빈대떡, 마약김밥, 육회, 칼국수, 약과 — 이 순서로 가세요.',
    author: '맛집헌터',
    passwordHash: '',
    createdAt: '2026-07-10T16:00:00.000Z',
    views: 267,
    likes: 41,
    comments: [],
  },
  {
    id: 'seed-5',
    title: '서울숲 피크닉 준비물 체크리스트',
    content: '매트, 자외선 차단제, 물, 간식만 챙겨도 충분합니다.',
    author: '피크닉메이트',
    passwordHash: '',
    createdAt: '2026-07-12T12:00:00.000Z',
    views: 145,
    likes: 22,
    comments: [],
  },
]

async function ensureSeedHashes() {
  for (const post of seedPosts) {
    if (!post.passwordHash) {
      post.passwordHash = await hashPassword('1234')
    }
  }
}

function readPosts() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function writePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

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

let ready = null

async function ensureReady() {
  if (ready) return ready
  ready = (async () => {
    await ensureSeedHashes()
    if (!readPosts()) writePosts(seedPosts)
  })()
  return ready
}

function publicPost(post, likedIds) {
  const { passwordHash, ...rest } = post
  return {
    ...rest,
    commentCount: post.comments?.length ?? 0,
    liked: likedIds.has(post.id),
  }
}

function delay(ms = 120) {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * postApi — REST-shaped mock backed by localStorage.
 * Swap implementation later to real HTTP without changing callers.
 */
export const postApi = {
  async list({ query = '', sort = 'latest' } = {}) {
    await ensureReady()
    await delay()
    const likedIds = readLikedIds()
    let posts = readPosts() || []
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
    return sorted.map((p) => publicPost(p, likedIds))
  },

  async hot(limit = 3) {
    await ensureReady()
    await delay()
    const likedIds = readLikedIds()
    const posts = [...(readPosts() || [])].sort((a, b) => b.likes - a.likes)
    return posts.slice(0, limit).map((p) => publicPost(p, likedIds))
  },

  async get(id, { incrementView = true } = {}) {
    await ensureReady()
    await delay()
    const posts = readPosts() || []
    const idx = posts.findIndex((p) => p.id === id)
    if (idx < 0) throw new Error('NOT_FOUND')
    if (incrementView) {
      posts[idx] = { ...posts[idx], views: posts[idx].views + 1 }
      writePosts(posts)
    }
    return publicPost(posts[idx], readLikedIds())
  },

  async create({ title, content, author, password }) {
    await ensureReady()
    await delay()
    if (!title?.trim() || !content?.trim() || !author?.trim() || !password) {
      throw new Error('VALIDATION')
    }
    const posts = readPosts() || []
    const post = {
      id: `p-${Date.now()}`,
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      passwordHash: await hashPassword(password),
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: [],
    }
    posts.unshift(post)
    writePosts(posts)
    return publicPost(post, readLikedIds())
  },

  async update(id, { title, content, password }) {
    await ensureReady()
    await delay()
    const posts = readPosts() || []
    const idx = posts.findIndex((p) => p.id === id)
    if (idx < 0) throw new Error('NOT_FOUND')
    const hash = await hashPassword(password)
    if (hash !== posts[idx].passwordHash) throw new Error('FORBIDDEN')
    posts[idx] = {
      ...posts[idx],
      title: title.trim(),
      content: content.trim(),
    }
    writePosts(posts)
    return publicPost(posts[idx], readLikedIds())
  },

  async remove(id, { password }) {
    await ensureReady()
    await delay()
    const posts = readPosts() || []
    const idx = posts.findIndex((p) => p.id === id)
    if (idx < 0) throw new Error('NOT_FOUND')
    const hash = await hashPassword(password)
    if (hash !== posts[idx].passwordHash) throw new Error('FORBIDDEN')
    posts.splice(idx, 1)
    writePosts(posts)
    const liked = readLikedIds()
    liked.delete(id)
    writeLikedIds(liked)
    return { ok: true }
  },

  async like(id) {
    await ensureReady()
    await delay()
    const posts = readPosts() || []
    const idx = posts.findIndex((p) => p.id === id)
    if (idx < 0) throw new Error('NOT_FOUND')
    const liked = readLikedIds()
    if (liked.has(id)) {
      liked.delete(id)
      posts[idx].likes = Math.max(0, posts[idx].likes - 1)
    } else {
      liked.add(id)
      posts[idx].likes += 1
    }
    writeLikedIds(liked)
    writePosts(posts)
    return publicPost(posts[idx], liked)
  },

  async addComment(id, { author, content }) {
    await ensureReady()
    await delay()
    if (!author?.trim() || !content?.trim()) throw new Error('VALIDATION')
    const posts = readPosts() || []
    const idx = posts.findIndex((p) => p.id === id)
    if (idx < 0) throw new Error('NOT_FOUND')
    const comment = {
      id: `c-${Date.now()}`,
      author: author.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    }
    posts[idx].comments = [...(posts[idx].comments || []), comment]
    writePosts(posts)
    return publicPost(posts[idx], readLikedIds())
  },

  async verifyPassword(id, password) {
    await ensureReady()
    const posts = readPosts() || []
    const post = posts.find((p) => p.id === id)
    if (!post) throw new Error('NOT_FOUND')
    const hash = await hashPassword(password)
    return hash === post.passwordHash
  },
}
