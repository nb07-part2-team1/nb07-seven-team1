import { BadRequestError, UnauthorizedError } from "../errors/customError.js";
export class entityGroup {
  constructor(data) {
    this.validate(data);
    this.id = data.id;
    this.ownerId = data.owner_id;
    this.ownerNickname = data.ownerNickname;
    this.name = data.name;
    this.tags = data.tags;
    this.goalRep = data.goalRep;
    this.photoUrl = data.photoUrl || null;
    this.password = data.password;
    this.description = data.description;
    this.discordWebhookUrl = data.discordWebhookUrl || null;
    this.discordInviteUrl = data.discordInviteUrl || null;
    this.likeCount = data.likeCount || 0;
    this.participantCount = data.participantCount || 1;
    this.createdAt = data.createdAt;
    this.owner = data.owner || null;
    this.participants = data.participants || [];
    this.updatedAt = data.updatedAt;
  }

  validate() {
    if (typeof this.name !== "string") {
      throw new BadRequestError("그룹 이름을 확인해주세요 (한/영).");
    }

    if (!this.ownerId || typeof this.ownerId !== "number") {
      throw new BadRequestError("방장아이디를 확인해주세요.");
    }
    if (!this.ownerNickname || typeof this.ownerNickname !== "string") {
      throw new BadRequestError("닉네임을 넣어주세요 (한/영)");
    }
    if (!this.password || typeof this.password !== "string") {
      throw new BadRequestError("비밀번호를 확인해주세요.");
    }
  }

  validatePassword(inputPassword) {
    if (this.password !== inputPassword) {
      throw new UnauthorizedError("비밀번호가 틀립니다");
    }
    return true;
  }

  isOwner(userId) {
    return this.ownerId === userId;
  }

  toResponse(recordCount = 0, badges = []) {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      photoUrl: this.photoUrl,
      goalRep: this.goalRep,
      discordWebhookUrl: this.discordWebhookUrl,
      discordInviteUrl: this.discordInviteUrl,
      likeCount: this.likeCount,
      recordCount: recordCount,
      tags: this.tags || [],

      owner: this.owner
        ? {
            id: this.owner.id,
            nickname: this.owner.nickname,
            createdAt: new Date(this.owner.createdAt).getTime(),
            updatedAt: new Date(this.owner.updatedAt).getTime(),
          }
        : null,

      participants: this.participants
        ? this.participants.map((p) => ({
            id: p.id,
            nickname: p.nickname,
            createdAt: new Date(p.createdAt).getTime(),
            updatedAt: new Date(p.updatedAt).getTime(),
          }))
        : [],
      createdAt: new Date(this.createdAt).getTime(),
      updatedAt: this.updatedAt
        ? new Date(this.updatedAt).getTime()
        : Date.now(),

      badges: badges,
    };
  }
}
