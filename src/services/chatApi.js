function delay(ms = 400) {
  return new Promise((r) => setTimeout(r, ms))
}

function buildReply(message) {
  const text = message.toLowerCase()
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

/**
 * chatApi — POST /api/chat shaped mock.
 */
export const chatApi = {
  async send({ message, history = [] }) {
    await delay()
    if (!message?.trim()) throw new Error('VALIDATION')
    return {
      reply: buildReply(message.trim()),
      history,
    }
  },
}
