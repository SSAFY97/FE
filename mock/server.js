import jsonServer from 'json-server'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.MOCK_PORT) || 3001
const dbPath = path.join(__dirname, 'db.json')

const server = jsonServer.create()
const router = jsonServer.router(dbPath)
const middlewares = jsonServer.defaults({ noCors: false })

function ok(data, message = '성공했습니다.') {
  return { response: 200, message, data }
}

function fail(res, status, message) {
  return res.status(status).json({ response: status, message, data: null })
}

function buildReply(message) {
  const text = String(message || '').toLowerCase()
  if (/안녕|헬로|hi|hello/.test(text)) {
    return '안녕하세요! LocalHub 여행 도우미입니다. 서울 관광지나 커뮤니티에 대해 물어보세요.'
  }
  if (/추천|가볼|관광/.test(text)) {
    return '요즘 인기 코스는 한강공원, 북촌 한옥마을, 남산타워입니다. 관광정보 탭에서 더 자세히 둘러보세요!'
  }
  if (/맛집|먹거리|음식/.test(text)) {
    return '광장시장, 망원시장, 익선동 골목이 인기예요. 커뮤니티에서 후기도 확인해 보세요.'
  }
  if (/숙소|숙박|호텔/.test(text)) {
    return '관광정보 → 숙박 카테고리에서 지역별로 찾아볼 수 있어요.'
  }
  if (/커뮤니티|게시|글쓰기/.test(text)) {
    return '커뮤니티에서 익명으로 글을 쓸 수 있어요. 작성·수정·삭제 시 비밀번호가 필요합니다.'
  }
  return `"${message}"에 대해 알아봤어요. 관광정보나 HOT 게시글을 함께 보시면 더 도움이 될 거예요!`
}

function syncBoardId(post) {
  if (!post || typeof post !== 'object') return post
  if (post.id != null && post.board_id == null) {
    post.board_id = post.id
  }
  if (post.board_id != null && post.id == null) {
    post.id = post.board_id
  }
  return post
}

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/api/chat', (req, res) => {
  const message = req.body?.message
  if (!message || !String(message).trim()) {
    return fail(res, 400, 'message가 필요합니다.')
  }
  return res.json(
    ok({ message: buildReply(String(message).trim()) }, '챗봇 응답에 성공했습니다.'),
  )
})

server.put('/api/posts', (req, res) => {
  const body = req.body || {}
  const id = Number(body.board_id ?? body.id)
  if (!Number.isFinite(id)) {
    return fail(res, 400, 'board_id가 필요합니다.')
  }
  const db = router.db
  const existing = db.get('posts').find({ id }).value()
  if (!existing) {
    return fail(res, 404, '게시글을 찾을 수 없습니다.')
  }
  const next = syncBoardId({
    ...existing,
    ...body,
    id,
    board_id: id,
  })
  delete next.comments
  db.get('posts').find({ id }).assign(next).write()
  return res.json(ok(next, '게시글 수정에 성공했습니다.'))
})

server.use((req, _res, next) => {
  if (req.method === 'POST' && req.path === '/api/posts') {
    const body = req.body || {}
    req.body = {
      board_title: body.board_title ?? '',
      board_content: body.board_content ?? '',
      board_writer: body.board_writer ?? '',
      board_password: body.board_password ?? '',
      board_views: 0,
      board_likes: 0,
      created_at: new Date().toISOString(),
    }
  }
  next()
})

router.render = (req, res) => {
  let data = res.locals.data
  if (Array.isArray(data)) {
    data = data.map((item) => syncBoardId(item))
  } else {
    data = syncBoardId(data)
    if (data && req.method === 'POST' && String(req.path).includes('posts')) {
      data.board_id = data.id
      router.db.get('posts').find({ id: data.id }).assign({ board_id: data.id }).write()
    }
  }
  res.jsonp(ok(data))
}

server.use('/api', router)

server.listen(PORT, () => {
  console.log(`Mock API server running at http://localhost:${PORT}`)
})
