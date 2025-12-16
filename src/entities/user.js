import { BadRequestError } from "../errors/customError.js";

const validateName = (name) => {
  const nameRegex = /^[a-z0-9가-힣]+$/;

  if (!name || name.trim().length === 0) {
    throw new BadRequestError({
      path: "nickname",
      message: "nickname is required",
    });
  }
  if (/\s/.test(name)) {
    throw new BadRequestError({
      path: "nickname",
      message: "닉네임에 공백은 넣을 수 없습니다",
    });
  }
  if (name.length < 3 || name.length > 10) {
    throw new BadRequestError({
      path: "nickname",
      message: "n닉네임은 3 ~ 10자로 작성해 주세요",
    });
  }
  if (!nameRegex.test(name)) {
    throw new BadRequestError({
      path: "nickname",
      message: "닉네임은 한글, 영문, 숫자만 사용 가능합니다",
    });
  }
};

const validatePassword = (password) => {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,20}$/;

  if (!password || password.trim().length === 0) {
    throw new BadRequestError({
      path: "password",
      message: "비밀번호를 입력해 주세요",
    });
  }
  if (password.length < 8 || password.length > 20) {
    throw new BadRequestError({
      path: "password",
      message: "비밀번호는 8 ~ 20자로 작성해 주세요",
    });
  }
  if (!regex.test(password)) {
    throw new BadRequestError({
      path: "password",
      message: "비밀번호는 영문 + 숫자 + 특수문자를 포함해야 합니다",
    });
  }
  if (/\s/.test(password)) {
    throw new BadRequestError({
      path: "password",
      message: "비밀번호에 공백은 넣을 수 없습니다",
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
