// db에 값을 넣거나, db에서 값을 받아올 때 검증이 필요하다.
// 엔티티라는것을 이용해서 검증을한다.

import { stringify } from "node:querystring";
import { BadRequestError } from "../errors/customError";

//db 에 넣는 값  검증 엔티티
// {
//   "name": "string",
//   "description": "string",
//   "photoUrl": "string",
//   "goalRep": 0,
//   "discordWebhookUrl": "string",
//   "discordInviteUrl": "string",
//   "tags": [
//     "string"
//   ],
//   "ownerNickname": "string",
//   "ownerPassword": "string"
export class UnregistereGroup {
  constructor(
    id,
    name,
    description,
    photoUrl,
    goalRep,
    discordWebhookUrl,
    discordInviteUrl
  ) {
    ((this.id = id),
      (this.name = name),
      (this.description = description),
      (this.photoUrl = photoUrl),
      (this.goalRep = goalRep),
      (this.discordWebhookUrl = discordWebhookUrl),
      (this.discordInviteUrl = discordInviteUrl));
  }

  static formInfo(name, description, photoUrl, goalRep, discordWebhookUrl) {
    if (typeof name !== String) {
      new BadRequestError("name 문자열이 아님.");
    }
    if (typeof description !== String) {
      new BadRequestError("description 문자열 아님");
    }
    if (typeof photoUrl !== String) {
      new BadRequestError("photoUrl 문자열 아님");
    }
    if (typeof discordWebhookUrl !== String) {
      new BadRequestError("discordWebhookUrl 문자열 아님");
    }
    if (typeof discordInviteUrl !== String) {
      new BadRequestError("discordInviteUrl 문자열 아님");
    }
    if (typeof tags !== String) {
      new BadRequestError("tags 문자열 아님");
    }
    const info = {
      name,
      description,
      tags,
      image: photoUrl,
      goal_rep: goalRep,
      discord_web_url: discordWebhookUrl,
      discord_server_url: discordInviteUrl,
    };
    return new UnregistereGroup(info.name, info.description, info.image);
  }
}

// db에서 가져온거 검증하는 엔티티
export class Group {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.goalReps = data.goal_reps;
    this.disc = data.image;
    this.discord_web_url = data.discord_web_url;
    this.discord_server_url = data.discord_server_url;
    this.like_count = data.like_count;
    this.created_at = data.created_at;
  }

  static formEntity({
    id,
    name,
    description,
    tags,
    goalRep,
    image,
    discordWebUrl,
    discordServerUrl,
    likeCount,
    created_at,
  }) {
    // 스타일변환
    const info = {
      id,
      name,
      description,
      tags,
      goal_rep: goalRep,
      photoUrl: image,
      discord_web_url: discordWebUrl,
      discord_server_url: discordServerUrl,
      like_count: likeCount,
      createdAt: created_at,
    };
    return new Group(info);
  }
}
