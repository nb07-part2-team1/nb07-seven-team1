import { BadRequestError } from "../../src/errors/customError.js";

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
    createAt,
    updateAt
  ) {
    this.id = String(id);
    this.name = name;
    this.tags = tags;
    this.goalReps = goalReps;
    this.image = image;
    this.discordWebUrl = discordWebUrl;
    this.discordServerUrl = discordServerUrl;
    this.likeCount = likeCount;
    this.createAt = createAt;
    this.updateAt = updateAt;
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
    createAt,
    updateAt
  ) {
    return new Group(
      id,
      name,
      tags,
      goalReps,
      image,
      discordWebUrl,
      discordServerUrl,
      likeCount,
      createAt,
      updateAt
    );
  }
}

export class Owner {
  constructor(id, nickName, userId, groupId, createAt, updateAt) {
    this.id = String(id);
    this.nickName = nickName;
    this.userId = String(userId);
    this.groupId = String(groupId);
    this.createAt = createAt;
    this.updateAt = updateAt;
  }

  static create(id, nickName, userId, groupId, createAt, updateAt) {
    return new Owner(id, nickName, userId, groupId, createAt, updateAt);
  }
}

export class User {
  constructor(id, name, password) {
    this.id = String(id);
    this.name = name;
    this.password = password;
  }

  static create(id = null, name, password) {
    validate(name, password);
    return new User(id, name, password);
  }

  //bigInt type 변환
  static idToString(id) {
    return new User(id);
  }
}

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
