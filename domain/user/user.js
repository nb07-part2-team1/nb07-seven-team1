import { BadRequestError } from "../../src/errors/customError.js";

export class User {
  constructor(id, name, passowrd) {
    this.id = String(id);
    this.name = name;
    this.passowrd = passowrd;
  }

  static create(id = null, name, password) {
    validate(name, password);
    return new User(id, name, password);
  }
}

function validateName(name) {
  const nameRegex = /^[a-z0-9가-힣]+$/;

  if (!name || name.trim().length === 0) {
    throw new BadRequestError("닉네임을 입력해 주세요");
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
