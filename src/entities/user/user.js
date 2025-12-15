import { BadRequestError } from "../../errors/customError.js";

function validateName(name) {
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
}

function validatePassword(password) {
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
}

function validateBcryptPassword(password) {
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
}

function validateId(id) {
  if (typeof id !== "string") {
    throw new BadRequestError({
      path: "id",
      message: `Invalid id type ${typeof id}`,
    });
  }
}
function validateUserId(userId) {
  if (typeof userId !== "string") {
    throw new BadRequestError({
      path: "userId",
      message: `Invalid id type ${typeof userId}`,
    });
  }
}
function validateGroupId(groupId) {
  if (typeof groupId !== "string") {
    throw new BadRequestError({
      path: "groupId",
      message: `Invalid id type ${typeof groupId}`,
    });
  }
}
function validateCreatedAt(createdAt) {
  if (!(createdAt instanceof Date) || Number.isNaN(createdAt.getTime())) {
    throw new BadRequestError({
      path: "createdAt",
      message: `Invalid createdAt ${createdAt.toString()}`,
    });
  }
}
function validateUpdatedAt(updatedAt) {
  if (!(updatedAt instanceof Date) || Number.isNaN(updatedAt.getTime())) {
    throw new BadRequestError({
      path: "updatedAt",
      message: `Invalid updatedAt ${updatedAt.toString()}`,
    });
  }
}

function validateUnregistedUser({ name, password }) {
  validateName(name);
  validatePassword(password);
}

function validateUser({
  name,
  password,
  id,
  group_id,
  created_at,
  updated_at,
}) {
  validateName(name);
  validateBcryptPassword(password);
  validateId(id);
  validateGroupId(group_id);
  validateCreatedAt(created_at);
  validateUpdatedAt(updated_at);
}

function validateUserInOner({
  id,
  nickName,
  userId,
  groupId,
  createdAt,
  updatedAt,
}) {
  validateId(id);
  validateName(nickName);
  validateUserId(userId);
  validateGroupId(groupId);
  validateCreatedAt(createdAt);
  validateUpdatedAt(updatedAt);
}

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

//user group instance 용도
export class Group {
  constructor(
    id,
    name,
    tags,
    goalReps,
    image,
    discordWebUrl,
    discordServerUrl,
    likeCount,
    createdAt,
    updatedAt
  ) {
    this.id = id;
    this.name = name;
    this.tags = tags;
    this.goalReps = goalReps;
    this.image = image;
    this.discordWebUrl = discordWebUrl;
    this.discordServerUrl = discordServerUrl;
    this.likeCount = likeCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({
    id,
    name,
    tags,
    goal_reps,
    image,
    discord_web_url,
    discord_server_url,
    like_count,
    created_at,
    updated_at,
  }) {
    return new Group(
      id.toString(),
      name,
      tags,
      goal_reps,
      image,
      discord_web_url,
      discord_server_url,
      like_count,
      created_at,
      updated_at
    );
  }
}
