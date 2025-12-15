export function userResponse(resUserData) {
  return {
    id: resUserData.id,
    name: resUserData.name,
    description: "string",
    photoUrl: "string",
    goalRep: 0,
    discordWebhookUrl: "string",
    discordInviteUrl: "string",
    likeCount: 0,
    tags: ["string"],
    owner: {
      id: 0,
      nickname: "string",
      createdAt: 0,
      updatedAt: 0,
    },
    participants: [
      {
        id: 0,
        nickname: "string",
        createdAt: 0,
        updatedAt: 0,
      },
    ],
    createdAt: 0,
    updatedAt: 0,
    badges: ["string"],
  };
}
