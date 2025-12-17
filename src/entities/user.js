import {
  validateRequired,
  validateWhitespace,
  validateDate,
  validateInt,
  validateString,
  validateLength,
} from "../utils/validators.common.js";
import {
  validateNameRegex,
  validatePasswordRegex,
} from "../utils/validators.user.js";

//UnregistedUser 검증
const validateUnregisteredUserName = (name) => {
  const validateInfo = { value: name, path: "nickname" };
  validateRequired(validateInfo);
  validateWhitespace(validateInfo);
  validateLength({ ...validateInfo, minLength: 3, MaxLength: 10 });
  validateNameRegex(validateInfo);
};
const validateUnregisteredUserPassword = (password) => {
  const validateInfo = { value: password, path: "password" };
  validateRequired(validateInfo);
  validateWhitespace(validateInfo);
  validateLength({ ...validateInfo, minLength: 8, MaxLength: 20 });
  validatePasswordRegex(validateInfo);
};
const validateUnregisteredUserGroupId = (groupId) => {
  const validateInfo = { value: groupId, path: "groupId" };
  validateRequired(validateInfo);
};
const validateUnregisteredUser = ({ name, password, groupId }) => {
  validateUnregisteredUserName(name);
  validateUnregisteredUserPassword(password);
  validateUnregisteredUserGroupId(groupId);
};

//User 검증
const validateUserId = (id) => {
  const validateInfo = { value: id, path: "id" };
  validateRequired(validateInfo);
  validateInt(validateInfo);
};
const validateUserUserId = (userId) => {
  const validateInfo = { value: userId, path: "userId" };
  validateRequired(validateInfo);
  validateString(validateInfo);
};
const validateUserGroupId = (groupId) => {
  const validateInfo = { value: groupId, path: "groupId" };
  validateRequired(validateInfo);
  validateInt(validateInfo);
};
const validateUserCreatedAt = (createdAt) => {
  const validateInfo = { value: createdAt, path: "createdAt" };
  validateRequired(validateInfo);
  validateDate(validateInfo);
};
const validateUserUpdatedAt = (updatedAt) => {
  const validateInfo = { value: updatedAt, path: "updatedAt" };
  validateRequired(validateInfo);
  validateDate(validateInfo);
};

const validateUser = ({ id, nickname, groupId, createdAt, updatedAt }) => {
  validateUserId(id);
  validateUserUserId(nickname);
  validateUserGroupId(groupId);
  validateUserCreatedAt(createdAt);
  validateUserUpdatedAt(updatedAt);
};

export class User {
  constructor({ id, nickname, groupId, createdAt, updatedAt }) {
    this.id = id;
    this.nickname = nickname;
    this.groupId = groupId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static formEntity({ id, name, group_id, created_at, updated_at }) {
    const info = {
      id: parseInt(id),
      nickname: name,
      groupId: parseInt(group_id),
      createdAt: created_at,
      updatedAt: updated_at,
    };
    // validateUser(info);

    return new User(info);
  }
}

export class UnregisteredUser {
  constructor({ name, password, group_id }) {
    this.name = name;
    this.password = password;
    this.group_id = group_id;
  }

  static formInfo({ name, password, groupId }) {
    const info = {
      name,
      password,
      group_id: BigInt(groupId),
    };
    // validateUnregisteredUser({
    //   name: info.name,
    //   password: info.password,
    //   groupId: info.group_id,
    // });

    return new UnregisteredUser(info);
  }
}
