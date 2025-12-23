import app from "./src/app.js";

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send({
    name: "SEVEN RESTful API server",
    version: "1.0.0",
    endpoints: {
      groups: {
        "GET /groups": "그룹 목록 조회",
        "POST /groups": "그룹 생성",
        "GET /groups/:groupId": "그룹 상세 조회",
        "PATCH /groups/:groupId": "그룹 수정",
        "DELETE /groups/:groupId": "그룹 삭제",
      },
      participants: {
        "POST /groups/:groupId/participants": "그룹 참가",
        "DELETE /groups/:groupId/users/:userId/participants": "그룹 탈퇴",
      },
      rank: {
        "GET /groups/:groupId/rank": "운동기록 랭킹 조회",
      },
      like: {
        "POST /groups/:groupId/likes": "좋아요 증가",
        "DELETE /groups/:groupId/likes": "좋아요 감소",
      },
      workdoutLogs: {
        "GET /groups/:groupId/records": "운동 기록 목록 조회",
        "GET /groups/:groupId/records/:recordId": "운동 기록 상세 조회",
        "POST /groups/:groupId/records": "운동 기록 생성",
      },
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
