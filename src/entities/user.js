import { BadRequestError } from "../errors/customError.js";
import {
  validateRequired,
  validateWhitespace,
} from "../utils/validators.common.js";
import {
  validateLength,
  validateNameRegex,
  validatePasswordRegex,
} from "../utils/validators.user.js";

const validateName = (name) => {
  const validateInfo = { value: name, path: "nickname" };

  validateRequired(validateInfo);
  validateWhitespace(validateInfo);
  validateLength({ ...validateInfo, minLength: 3, kMaxLength: 10 });
  validateNameRegex(validateInfo);
};

const validatePassword = (password) => {
  const validateInfo = { value: password, path: "password" };

  validateRequired(validateInfo);
  validateWhitespace(validateInfo);
  validateLength({ ...validateInfo, minLength: 8, kMaxLength: 20 });
  validatePasswordRegex(validateInfo);
};

const validateId = (id) => {
  if (typeof id !== "string") {
    throw new BadRequestError({
      path: "id",
      message: `Invalid id type ${typeof id}`,
    });
  }
};
const validateUserId = (userId) => {
  if (typeof userId !== "string") {
    throw new BadRequestError({
      path: "userId",
      message: `Invalid id type ${typeof userId}`,
    });
  }
};
const validateGroupId = (groupId) => {
  if (typeof groupId !== "string") {
    throw new BadRequestError({
      path: "groupId",
      message: `Invalid id type ${typeof groupId}`,
    });
  }
};
const validateCreatedAt = (createdAt) => {
  if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
    throw new BadRequestError({
      path: "createdAt",
      message: `Invalid createdAt ${createdAt.toString()}`,
    });
  }
};
const validateUpdatedAt = (updatedAt) => {
  if (!(updatedAt instanceof Date) || Number.isNaN(updatedAt.getTime())) {
    throw new BadRequestError({
      path: "updatedAt",
      message: `Invalid updatedAt ${updatedAt.toString()}`,
    });
  }
};

const validateUnregistedUser = ({ name, password }) => {
  validateName(name);
  validatePassword(password);
};

const validateUser = ({
  nickname,
  password,
  id,
  groupId,
  createdAt,
  updatedAt,
}) => {
  validateName(nickname);
  validateBcryptPassword(password);
  validateId(id);
  validateGroupId(groupId);
  validateCreatedAt(createdAt);
  validateUpdatedAt(updatedAt);
};

const validateUserInOner = ({
  id,
  nickName,
  userId,
  groupId,
  createdAt,
  updatedAt,
}) => {
  validateId(id);
  validateName(nickName);
  validateUserId(userId);
  validateGroupId(groupId);
  validateCreatedAt(createdAt);
  validateUpdatedAt(updatedAt);
};

//user
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
    // validateUnregistedUser({ name: info.name, password: info.password });

    return new UnregisteredUser(info);
  }
}
