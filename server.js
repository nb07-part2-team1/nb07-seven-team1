import app from "./src/app.js";

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send({
    name: "SEVEN RESTful API server",
    version: "1.0.0",
    endpoints: {
      groups: {
        "GET /api/groups": "그룹 목록 조회",
        "POST /api/groups": "그룹 생성",
        "GET /api/groups/:groupId": "그룹 상세 조회",
        "PATCH /api/groups/:groupId": "그룹 수정",
        "DELETE /api/groups/:groupId": "그룹 삭제",
      },
      participants: {
        "POST /api/groups/:groupId/participants": "그룹 참가",
        "DELETE /api/groups/:groupId/users/:userId/participants": "그룹 탈퇴",
      },
      rank: {
        "GET /api/groups/:groupId/rank": "운동기록 랭킹 조회",
      },
      like: {
        "POST /api/groups/:groupId/likes": "좋아요 증가",
        "DELETE /api/groups/:groupId/likes": "좋아요 감소",
      },
      workdoutLogs: {
        "GET /api/groups/:groupId/records": "운동 기록 목록 조회",
        "GET /api/groups/:groupId/records/:recordId": "운동 기록 상세 조회",
        "POST /api/groups/:groupId/records": "운동 기록 생성",
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
