import { User, Owner, Group } from "../../../domain/user/user.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../../errors/customError.js";
import { prisma } from "../../../prisma/prisma.js";
import bcrypt from "bcrypt";

/**
 * user create
 */
export async function createUserInGroup({ nickname, password, groupId }) {
  const user = User.create(null, nickname.toLowerCase(), password);
  await nameToCheck(user.name, groupId);
  const hashedPassword = await hashPassword(user.password);

  const createUser = await prisma.user.create({
    data: {
      name: user.name,
      password: hashedPassword,
      group_id: groupId,
    },
  });
  const userId = User.idToString(createUser.id);
  createUser.id = userId;

  return createUser;
}

async function nameToCheck(name, groupId) {
  const user = await prisma.user.findFirst({
    where: {
      name: name,
      group_id: groupId,
    },
  });
  if (user) {
    throw new ConflictError({ message: "중복된 닉네임 입니다" });
  }

  return;
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * user delete
 */
export async function deleteUserInGroup({ nickname, password, groupId }) {
  const user = User.create(null, nickname, password);
  const getUser = await findUser(user.name, user.password, groupId);

  await prisma.user.delete({
    where: {
      id: getUser.id,
    },
  });
}

async function findUser(name, password, groupId) {
  const findUser = await prisma.user.findFirst({
    where: {
      name,
      group_id: groupId,
    },
  });

  if (!findUser) {
    throw new NotFoundError({
      path: "nickname",
      message: "nickname is required",
    });
  }

  const isMatch = await verifyPassword(password, findUser.password);
  if (findUser.name === name && !isMatch) {
    throw new UnauthorizedError({
      path: "password",
      message: "wrong password",
    });
  }

  return findUser;
}

async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
}

/**
 * group, owner
 * reponse data GET
 */
export async function getGroup(groupId) {
  const groupData = await prisma.group.findFirst({
    where: {
      id: Number(groupId),
    },
  });

  const groupRes = Group.create(
    groupData.id,
    groupData.name,
    groupData.data,
    groupData.goal_reps,
    groupData.image,
    groupData.discord_web_url,
    groupData.discord_server_url,
    groupData.like_count,
    groupData.created_at,
    groupData.updated_at
  );

  return groupRes;
}

export async function getOwner(groupId) {
  const ownerData = await prisma.owner.findFirst({
    where: {
      group_id: Number(groupId),
    },
  });

  const ownerNickname = await prisma.user.findFirst({
    where: {
      id: ownerData.user_id,
      group_id: Number(groupId),
    },
  });

  const owner = Owner.create(
    ownerData.id,
    ownerNickname.name,
    ownerData.user_id,
    ownerData.group_id,
    ownerData.created_at,
    ownerData.updated_at
  );

  return owner;
}
