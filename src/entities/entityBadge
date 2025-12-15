import { BadRequestError } from "../errors/customError";

export class Badge {
  constructor(data) {
    this.id = data.id;
    this.content = data.content;
    this.createdAt = data.createdAt;
    this.groupId = data.groupId;
  }

  static formEntity({ id, content, created_at, group_id }) {
    const info = {
      id: parseInt(id),
      content,
      createdAt: created_at,
      groupId: parseInt(group_id),
    };

    if (typeof content !== "string") {
      new BadRequestError("content타입이 문자열이 아님");
    }

    return new Badge(info);
  }
}

export class UnregistereBadge {
  constructor(content, group_id) {
    this.content = content;
    this.group_id = group_id;
  }

  static fromInfo({ content, groupId }) {
    const info = {
      content,
      group_id: groupId,
    };

    if (typeof content !== "string") {
      new BadRequestError("content 문자열이 아님");
    }

    return new UnregistereBadge(info);
  }
}
