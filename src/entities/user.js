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

const validateBcryptPassword = (password) => {
  const BCRYPT_REGEX = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
  if (typeof password !== "string") {
    throw new BadRequestError({
      path: "hash password",
      message: "Invalid password string format",
    });
  }
  if (!BCRYPT_REGEX.test(password)) {
    throw new BadRequestError({
      path: "hash password",
      message: "Invalid password hash format",
    });
  }
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
  name,
  password,
  id,
  group_id,
  created_at,
  updated_at,
}) => {
  validateName(name);
  validateBcryptPassword(password);
  validateId(id);
  validateGroupId(group_id);
  validateCreatedAt(created_at);
  validateUpdatedAt(updated_at);
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
  constructor({ id, name, password, groupId, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.groupId = groupId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ id, name, password, group_id, created_at, updated_at }) {
    const info = {
      id: id.toString(),
      name,
      password,
      group_id: group_id.toString(),
      created_at,
      updated_at,
    };
    validateUser(info);

    return new User(info);
  }
}

export class UnregisteredUser {
  constructor({ name, password, groupId }) {
    this.name = name;
    this.password = password;
    this.groupId = groupId;
  }

  static create({ name, password, groupId }) {
    const info = {
      name,
      password,
      groupId,
    };
    validateUnregistedUser({ name: info.name, password: info.password });

    return new UnregisteredUser(info);
  }
}

//owner
export class UserInOwner {
  constructor({ id, nickName, userId, groupId, createdAt, updatedAt }) {
    this.id = id;
    this.nickName = nickName;
    this.userId = userId;
    this.groupId = groupId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ id, nickName, userId, groupId, createdAt, updatedAt }) {
    const info = {
      id: id.toString(),
      nickName,
      userId: userId.toString(),
      groupId: groupId.toString(),
      createdAt,
      updatedAt,
    };
    validateUserInOner(info);

    return new UserInOwner(info);
  }
}
