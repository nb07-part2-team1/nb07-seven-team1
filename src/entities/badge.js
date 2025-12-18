import { validateUnregisteredBadge, validateBadge } from "../utils/validators";

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

    //검증 로직
    validateBadge(info);

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

    //검증 로직
    validateUnregisteredBadge(info);

    return new UnregistereBadge(info);
  }
}
