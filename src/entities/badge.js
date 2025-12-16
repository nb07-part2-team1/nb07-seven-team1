import { BadRequestError } from "../errors/customError.js";

export class Badge {
  constructor({ id, content, createdAt, groupId }) {
    this.id = id;
    this.content = content;
    this.createdAt = createdAt;
    this.groupId = groupId;
  }

  static formEntity({ id, content, created_at, group_id }) {
    const info = {
      id: parseInt(id),
      content,
      createdAt: created_at,
      groupId: parseInt(group_id),
    };

    // if (typeof content !== "string") {
    //   new BadRequestError("content타입이 문자열이 아님");
    // }

    return new Badge(info);
  }
}

export class UnregistereBadge {
  constructor({ content, group_id }) {
    this.content = content;
    this.group_id = group_id;
  }

  static formInfo({ content, groupId }) {
    const info = {
      content,
      group_id: BigInt(groupId),
    };

    // if (typeof content !== "string") {
    //   new BadRequestError("content 문자열이 아님");
    // }

    return new UnregistereBadge(info);
  }
}
