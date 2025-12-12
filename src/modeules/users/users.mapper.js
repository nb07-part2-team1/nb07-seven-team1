export function userResponse(resUserData, resGroupData, resOwnerData) {
  return {
    id: resGroupData.id,
    name: resGroupData.name,
    description: "string", //스키마에 description 추가해야 함
    photoUrl: resGroupData.image,
    goalRep: resGroupData.goal_reps,
    discordWebhookUrl: resGroupData.discord_web_url,
    discordInviteUrl: resGroupData.discord_server_url,
    likeCount: resGroupData.like_count,
    tags: resGroupData.tags,
    owner: {
      id: resOwnerData.id,
      nickname: resOwnerData.nickName,
      createdAt: resOwnerData.createdAt,
      updatedAt: resOwnerData.updatedAt,
    },
    participants: [
      {
        id: resUserData.id,
        nickname: resUserData.name,
        createdAt: resUserData.created_at,
        updatedAt: resUserData.updated_at,
      },
    ],
    createdAt: 0,
    updatedAt: 0,
    badges: ["string"],
  };
}
