import { BadRequestError } from "../../src/errors/customError.js";

function validateName(name) {
  const nameRegex = /^[a-z0-9가-힣]+$/;

  if (!name || name.trim().length === 0) {
    throw new BadRequestError({
      path: "nicknmae",
      message: "nickname is required",
    });
  }
  if (/\s/.test(name)) {
    throw new BadRequestError("닉네임에 공백은 넣을 수 없습니다");
  }
  if (name.length < 3 || name.length > 10) {
    throw new BadRequestError("닉네임은 3 ~ 10자로 작성해 주세요");
  }
  if (!nameRegex.test(name)) {
    throw new BadRequestError("닉네임은 한글, 영문, 숫자만 사용 가능합니다");
  }
}

function validatePassword(password) {
  const regex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-={}[\]:;"'<>,.?/]).{8,20}$/;

  if (!password || password.trim().length === 0) {
    throw new BadRequestError("비밀번호를 입력해 주세요");
  }
  if (password.length < 8 || password.length > 20) {
    throw new BadRequestError("비밀번호는 8 ~ 20자로 작성해 주세요");
  }
  if (!regex.test(password)) {
    throw new BadRequestError(
      "비밀번호는 영문 + 숫자 + 특수문자를 포함해야 합니다"
    );
  }
  if (/\s/.test(password)) {
    throw new BadRequestError("비밀번호에 공백은 넣을 수 없습니다");
  }
}

function validate(name, password) {
  validateName(name);
  validatePassword(password);
}

//user
export class User {
  constructor(id, name, password, groupId, createdAt, updatedAt) {
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

    return new User(
      info.id,
      info.name,
      info.password,
      info.group_id,
      info.created_at,
      info.updated_at
    );
  }
}

export class UnregisteredUser {
  constructor(name, password, groupId) {
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
    validate(info.name, info.password);

    return new unregisteredUser(info.name, info.password, info.groupId);
  }
}

//owner
export class UserInOwner {
  constructor(id, nickName, userId, groupId, createdAt, updatedAt) {
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

    return new UserInOwner(
      info.id,
      info.nickName,
      info.userId,
      info.groupId,
      info.createdAt,
      info.updatedAt
    );
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

  static create(
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
    return new Group(
      id.toString(),
      name,
      tags,
      goalReps,
      image,
      discordWebUrl,
      discordServerUrl,
      likeCount,
      createdAt,
      updatedAt
    );
  }
}
