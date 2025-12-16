import { prisma } from "../../../prisma/prisma.js";
import bcrypt from "bcrypt";
import { UnregisteredUser, User } from "../../entities/user.js";
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
} from "../../errors/customError.js";

/**
 * user create function
 */
const createUserInGroup = async ({ nickname, password, groupId }) => {
  const unregUser = UnregisteredUser.formInfo({
    name: nickname.toLowerCase(),
    password,
    groupId,
  });
  await nameToCheck(unregUser.name, unregUser.groupId);
  const hashedPassword = await hashPassword(unregUser.password);

  const createUser = await prisma.user.create({
    data: {
      name: unregUser.name,
      password: hashedPassword,
      group_id: groupId,
    },
  });
  const user = User.formEntity(createUser);

  return user;
};

const nameToCheck = async (name, groupId) => {
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
};

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * user delete function
 */
const deleteUserInGroup = async ({ nickname, password, groupId }) => {
  const unregUser = UnregisteredUser.formInfo({
    name: nickname.toLowerCase(),
    password,
    groupId,
  });
  const getUser = await findUser(
    unregUser.name,
    unregUser.password,
    unregUser.group_id
  );

  await prisma.user.delete({
    where: {
      id: getUser.id,
    },
  });
};

const findUser = async (name, password, groupId) => {
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
};

const verifyPassword = async (inputPassword, hashedPassword) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

/**
 * owner function
 * reponse data GET
 */
const getOwner = async (groupId) => {
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

  const owner = {
    id: ownerData.id,
    nickName: ownerUserData.name,
    userId: ownerUserData.id,
    groupId: ownerUserData.group_id,
    createdAt: ownerUserData.created_at,
    updatedAt: ownerUserData.updated_at,
  };

  return owner;
};

//mapper
const userResponse = (resUserData, resGroupData, resOwnerData, resBadge) => {
  return { id: 99999, name: "99999" };
  // return {
  //   id: resGroupData.id,
  //   name: resGroupData.name,
  //   description: resGroupData.description,
  //   photoUrl: resGroupData.image,
  //   goalRep: resGroupData.goalReps,
  //   discordWebhookUrl: resGroupData.discordWebUrl,
  //   discordInviteUrl: resGroupData.discordServerUrl,
  //   likeCount: resGroupData.likeCount,
  //   tags: resGroupData.tags,
  //   owner: {
  //     id: resOwnerData.id,
  //     nickname: resOwnerData.nickName,
  //     createdAt: resOwnerData.createdAt,
  //     updatedAt: resOwnerData.updatedAt,
  //   },
  //   participants: [
  //     {
  //       id: resUserData.id,
  //       nickname: resUserData.name,
  //       createdAt: resUserData.createdAt,
  //       updatedAt: resUserData.updatedAt,
  //     },
  //   ],
  //   createdAt: resGroupData.createdAt,
  //   updatedAt: resGroupData.updatedAt,
  //   badges: resBadge.content,
  // };
};

/**
 * createUser(그룹 참가)
 * deleteUser(그룹 참가 취소)
 */
export const createUser = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const { groupId } = req.params;

    //need response data *user, group, owner, badge*
    const resUserData = await createUserInGroup({
      nickname,
      password,
      groupId,
    });
    // const resGroupData = await getGroup(groupId);
    // const resOwnerData = await getOwner(groupId);
    // const resBadge = await getbadge(groupId);

    // const resData = userResponse(resUserData, resGroupData, resOwnerData);
    const resData = userResponse({});

    res.status(201).json(resData);
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
