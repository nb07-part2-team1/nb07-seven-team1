import { validateUser, validateUnregisteredUser } from "../utils/validators";

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

    //검증 로직
    validateUser(info);

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

    //검증 로직
    validateUnregisteredUser({
      name: info.name,
      password: info.password,
      groupId: info.group_id,
    });

    return new UnregisteredUser(info);
  }
}
