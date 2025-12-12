import { prisma } from "../../../prisma/prisma.js";
import bcrypt from "bcrypt";
import {
  unregisteredUser,
  User,
  UserInOwner,
  Group,
} from "../../../domain/user/user.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../../errors/customError.js";

export const createUser = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const { groupId } = req.params;

    const resUserData = await createUserInGroup({
      nickname,
      password,
      groupId,
    });
    const resGroupData = await getGroup(groupId);
    const resOwnerData = await getOwner(groupId);

    res.status(201).json(userResponse(resUserData, resGroupData, resOwnerData));
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const { groupId } = req.params;

    await deleteUserInGroup({
      nickname,
      password,
      groupId,
    });

    res.json({ message: "그룹 참여를 취소하였습니다" });
  } catch (e) {
    next(e);
  }
};

/**
 * user create function
 */
async function createUserInGroup({ nickname, password, groupId }) {
  const unregUser = unregisteredUser.create({
    name: nickname.toLowerCase(),
    password,
    groupId,
  });
  await nameToCheck(unregUser.name, groupId);
  const hashedPassword = await hashPassword(unregUser.password);
  const createUser = await prisma.user.create({
    data: {
      name: unregUser.name,
      password: hashedPassword,
      group_id: groupId,
    },
  });
  const user = User.create(createUser);

  return user;
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
 * user delete function
 */
async function deleteUserInGroup({ nickname, password, groupId }) {
  const unregUser = unregisteredUser.create({
    name: nickname,
    password,
    groupId,
  });
  const getUser = await findUser(
    unregUser.name,
    unregUser.password,
    unregUser.groupId
  );

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
 * group, owner function
 * reponse data GET
 */
async function getGroup(groupId) {
  const groupData = await prisma.group.findFirst({
    where: {
      id: Number(groupId),
    },
  });

  const groupRes = Group.create(
    groupData.id,
    groupData.name,
    groupData.tags,
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

async function getOwner(groupId) {
  const ownerData = await prisma.owner.findFirst({
    where: {
      group_id: Number(groupId),
    },
  });

  const ownerUserData = await prisma.user.findFirst({
    where: {
      id: ownerData.user_id,
      group_id: Number(groupId),
    },
  });

  const owner = UserInOwner.create({
    id: ownerData.id,
    nickName: ownerUserData.name,
    userId: ownerUserData.id,
    groupId: ownerUserData.group_id,
    createdAt: ownerUserData.created_at,
    updatedAt: ownerUserData.updated_at,
  });

  return owner;
}

//mapper
function userResponse(resUserData, resGroupData, resOwnerData) {
  return {
    id: resGroupData.id,
    name: resGroupData.name,
    description: "string", //스키마에 description 추가해야 함
    photoUrl: resGroupData.image,
    goalRep: resGroupData.goalReps,
    discordWebhookUrl: resGroupData.discordWebUrl,
    discordInviteUrl: resGroupData.discordServerUrl,
    likeCount: resGroupData.likeCount,
    tags: resGroupData.tags,
    owner: {
      id: resOwnerData.id,
      nickname: resOwnerData.nickName,
      createdAt: resOwnerData.createdAt,
      updatedAt: resOwnerData.updatedAt,
    },
    participants: [
      {
        id: resUserData.id,
        nickname: resUserData.name,
        createdAt: resUserData.createdAt,
        updatedAt: resUserData.updatedAt,
      },
    ],
    createdAt: resGroupData.createdAt,
    updatedAt: resGroupData.updatedAt,
    badges: ["string"],
  };
}
