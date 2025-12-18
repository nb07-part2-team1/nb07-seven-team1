import {
  validateRequired,
  validateDate,
  validateArray,
} from "../utils/validators.common.js";

//Badge 검증
const validateBadgeId = (id) => {
  const validateInfo = { value: id, path: "id" };
  validateRequired(validateInfo);
};
const validateBadgeContent = (content) => {
  const validateInfo = { value: content, path: "content" };
  validateRequired(validateInfo);
  validateArray(validateInfo);
};
const validateBadgeCreateAt = (createdAt) => {
  const validateInfo = { value: createdAt, path: "createdAt" };
  validateRequired(validateInfo);
  validateDate(validateInfo);
};
const validateBadgeGroupId = (groupId) => {
  const validateInfo = { value: groupId, path: "groupId" };
  validateRequired(validateInfo);
};
const validateBadge = ({ id, content, createdAt, groupId }) => {
  validateBadgeId(id);
  validateBadgeContent(content);
  validateBadgeCreateAt(createdAt);
  validateBadgeGroupId(groupId);
};

//UnregisteredBadge 검증
const validateUnregisteredBadgeId = (groupId) => {
  const validateInfo = { value: groupId, path: "groupId" };
  validateRequired(validateInfo);
};
const validateUnregisteredBadgeContent = (content) => {
  const validateInfo = { value: content, path: "content" };
  validateRequired(validateInfo);
  validateArray(validateInfo);
};
const validateUnregisteredBadge = ({ content, group_id }) => {
  validateUnregisteredBadgeId(group_id);
  validateUnregisteredBadgeContent(content);
};

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
