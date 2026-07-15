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

