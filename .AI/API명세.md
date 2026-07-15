# 기본 response body
{
	response: 200,
	message: "~성공했습니다.",
	data: 
}

# API 목록

## 챗봇 대화
- POST
- /api/chat
request body
{
    message: "질문사항"
}

response body (data부분)
{
    message: "답변 메시지"
}

## 지역정보 상세조회
- GET
- /api/locations/{id}
response body (data 부분)
{
	"contentid"
	"contenttypeid"
	"title"
	"addr1"
	"addr2"
	"tel"
	"firstimage"
	"firstimage2"
	"createdtime"
}

## 지역정보 목록조회
- GET
- /api/locations
response body (data 부분)
[{
	"contentid"
	"contenttypeid"
	"title"
	"addr1"
	"addr2"
	"mapx"
	"mapy"
	"firstimage2"
	"createdtime"
},{
	"contentid"
	"contenttypeid"
	"title"
	"addr1"
	"addr2"
	"mapx"
	"mapy"
	"firstimage2"
	"createdtime"
},{
	"contentid"
	"contenttypeid"
	"title"
	"addr1"
	"addr2"
	"mapx"
	"mapy"
	"firstimage2"
	"createdtime"
},...]

## 게시글 목록 조회
- GET 
- /api/posts
response body (data 부분)

[{
	"board_id" : 1,
	"board_title" : "제목",
	"board_content" : "내용",
	"board_writer" : "작성자",
	"board_password" : "1234",
	"board_views" : "조회수",
	"board_likes" : "좋아요수",
	"created_at" : "생성날짜",
},{
	"board_id" : 1,
	"board_title" : "제목",
	"board_content" : "내용",
	"board_writer" : "작성자",
	"board_password" : "1234",
	"board_views" : "조회수",
	"board_likes" : "좋아요수",
	"created_at" : "생성날짜",
},{
	"board_id" : 1,
	"board_title" : "제목",
	"board_content" : "내용",
	"board_writer" : "작성자",
	"board_password" : "1234",
	"board_views" : "조회수",
	"board_likes" : "좋아요수",
	"created_at" : "생성날짜",
}, ...]


## 게시글 상세조회
- GET
- /api/posts/{id}

response body (data 부분)

{
	"board_id" : 1,
	"board_title" : "제목",
	"board_content" : "내용",
	"board_writer" : "작성자",
	"board_password" : "1234",
	"board_views" : "조회수",
	"board_likes" : "좋아요수",
	"created_at" : "생성날짜",
}

## 게시글 작성
- POST
- /api/posts

request body
{
	"board_id" : 1,
	"board_title" : "제목",
	"board_content" : "내용",
	"board_writer" : "작성자",
	"board_password" : "1234",
}

## 게시글 수정
- PUT
- /api/posts

request body
{
	"board_id" : 1,
	"board_title" : "제목",
	"board_content" : "내용",
	"board_writer" : "작성자",
	"board_password" : "1234",
}


## 게시글 삭제
- DELETE
- /api/posts/{id}

## 보행자 길찾기
- POST
- /api/routes/pedestrian

request body
{
	"origin": {
		"name": "효사정",
		"latitude": 37.5106694129,
		"longitude": 126.9627647192
	},
	"destination": {
		"name": "용양봉저정공원",
		"latitude": 37.5118,
		"longitude": 126.9585
	}
}

response body (data 부분)
{
	"origin": {
		"name": "효사정",
		"latitude": 37.5106694129,
		"longitude": 126.9627647192
	},
	"destination": {
		"name": "용양봉저정공원",
		"latitude": 37.5118,
		"longitude": 126.9585
	},
	"straight_line_distance_meters": 397,
	"distance_meters": 1087,
	"duration_seconds": 913,
	"path": [
		{ "latitude": 37.51086, "longitude": 126.96296 }
	]
}

- origin / destination: 출발·도착 장소명과 WGS84 위경도
- straight_line_distance_meters: 직선 거리(m)
- distance_meters: 도보 경로 거리(m)
- duration_seconds: 예상 소요 시간(초)
- path: 경로 좌표 배열 (latitude, longitude)

