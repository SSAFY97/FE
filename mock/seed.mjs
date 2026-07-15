import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outFile = path.join(__dirname, 'db.json')

const seedPosts = [
  {
    id: 1,
    board_id: 1,
    board_title: '한강공원 야경 추천 코스',
    board_content:
      '여의도 → 반포 → 뚝섬 순으로 가보세요. 해질 무렵에 출발하면 분위기가 최고입니다.',
    board_writer: '서울나그네',
    board_password: '1234',
    board_views: 312,
    board_likes: 48,
    created_at: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 2,
    board_id: 2,
    board_title: '북촌 한옥마을 데이트 후기',
    board_content: '오전 일찍 가면 한적해요. 카페골목도 꼭 들러보세요.',
    board_writer: '주말탐험가',
    board_password: '1234',
    board_views: 198,
    board_likes: 36,
    created_at: '2026-07-05T14:30:00.000Z',
  },
  {
    id: 3,
    board_id: 3,
    board_title: '남산타워 가는 법 총정리',
    board_content: '케이블카보다 순환버스가 대기 짧았어요. 날씨 좋은 날 추천!',
    board_writer: '도시여행자',
    board_password: '1234',
    board_views: 421,
    board_likes: 55,
    created_at: '2026-07-08T09:15:00.000Z',
  },
  {
    id: 4,
    board_id: 4,
    board_title: '광장시장 먹거리 베스트 5',
    board_content: '빈대떡, 마약김밥, 육회, 칼국수, 약과 — 이 순서로 가세요.',
    board_writer: '맛집헌터',
    board_password: '1234',
    board_views: 267,
    board_likes: 41,
    created_at: '2026-07-10T16:00:00.000Z',
  },
  {
    id: 5,
    board_id: 5,
    board_title: '서울숲 피크닉 준비물 체크리스트',
    board_content: '매트, 자외선 차단제, 물, 간식만 챙겨도 충분합니다.',
    board_writer: '피크닉메이트',
    board_password: '1234',
    board_views: 145,
    board_likes: 22,
    created_at: '2026-07-12T12:00:00.000Z',
  },
]

let locations = []
if (fs.existsSync(outFile)) {
  try {
    const existing = JSON.parse(fs.readFileSync(outFile, 'utf8'))
    if (Array.isArray(existing.locations)) locations = existing.locations
  } catch {
    /* keep empty */
  }
}

const db = { posts: seedPosts, locations }
fs.writeFileSync(outFile, JSON.stringify(db, null, 2), 'utf8')
console.log(
  `Wrote ${outFile}: ${seedPosts.length} posts, ${locations.length} locations (preserved)`,
)
