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
  if (!name || name.trim().length === 0) {
    throw new Error("nickname is required");
  }
  if (name.length > 10) {
    throw new Error("nickname must be less than 10 characters");
  }
}

function validatePassword(password) {
  if (!password || password.trim().length === 0) {
    throw new Error("password is required");
  }
  if (password.lengh > 20) {
    throw new Error("password must be less than 20 characters");
  }
}

function validate(name, password) {
  validateName(name);
  validatePassword(password);
}
