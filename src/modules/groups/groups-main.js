// app.js 또는 index.js 최상단에 추가하세요
// BigInt.prototype.toJSON = function () {
//   return this.toString();
// };
import { UnregistereGroup } from "../../entities/group.js";
import { prisma } from "../../../prisma/prisma.js";
import { UnregisteredUser, User } from "../../entities/user.js";
import { UnauthorizedError } from "../../errors/customError.js";

const formatGroupResponse = (group) => {
  const owner = group.users.find((user) => group.owner.user_id === user.id);
  const participants = group.users.map((user) => ({
    id: Number(user.id),
    nickname: user.name,
    createdAt: user.created_at.getTime(),
    updatedAt: user.updated_at.getTime(),
  }));
  const badges = group.badges.map((badge) => badge.content);

  return {
    id: Number(group.id),
    name: group.name,
    description: group.description,
    photoUrl: group.image ?? null,
    goalRep: group.goal_reps,
    discordWebhookUrl: group.discord_web_url,
    discordInviteUrl: group.discord_server_url,
    likeCount: group.like_count,
    tags: group.tags ?? [],
    owner: {
      id: Number(owner.id),
      nickname: owner.name,
      createdAt: owner.created_at.getTime(),
      updatedAt: owner.updated_at.getTime(),
    },
    participants,
    createdAt: group.created_at.getTime(),
    updatedAt: group.updated_at.getTime(),
    badges,
  };
};
export const createGroup = async (req, res, next) => {
  try {
    const createGroupInfo = UnregistereGroup.formInfo(req.body);
    const createdGroup = await prisma.group.create({
      data: { ...createGroupInfo, like_count: 0 },
    });

    const createOwnerInfo = UnregisteredUser.formInfo({
      name: req.body.ownerNickname,
      password: req.body.ownerPassword,
      groupId: createdGroup.id,
    });

    const inputUser = await prisma.user.create({
      data: createOwnerInfo,
    });
    await prisma.owner.create({
      data: {
        user_id: inputUser.id,
        group_id: createdGroup.id,
      },
    });
    const newGroupInfo = await prisma.group.findUnique({
      where: { id: createdGroup.id },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });
    const result = formatGroupResponse(newGroupInfo);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getGroup = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;

    const newGroupInfo = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

    const result = formatGroupResponse(newGroupInfo);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
const getOrderBy = (order, direction) => {
  switch (order) {
    case "likeCount":
      return { like_count: direction };

    case "participantCount":
      return {
        users: {
          _count: direction,
        },
      };

    case "createdAt":
    default:
      return { created_at: direction };
  }
};

export const getGroups = async (req, res, next) => {
  try {
    const { page, limit, order, orderBy, search } = req.query;
    const newOrderBy = getOrderBy(orderBy, order);
    const [groups, groupCount] = await Promise.all([
      prisma.group.findMany({
        ...(!search && {
          where: { name: { contains: search, mode: "insensitive" } },
        }),
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: newOrderBy,
        include: {
          owner: true,
          users: true,
          badges: true,
        },
      }),
      prisma.group.count(),
    ]);

    // const result = groups.map((group) => formatGroupResponse(group));
    const result = groups.map((group) => {
      return formatGroupResponse(group);
    });

    res.status(200).json({ data: result, total: groupCount });
  } catch (error) {
    next(error);
  }
};
const verifyGroupOwner = async (groupId, password) => {
  const groupWithOwnerUser = await prisma.group.findUnique({
    where: {
      id: BigInt(groupId),
    },
    include: {
      owner: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!groupWithOwnerUser)
    throw new UnauthorizedError({ message: "User not found" });

  if (String(groupWithOwnerUser.owner.user.password) !== String(password)) {
    throw new UnauthorizedError({
      message: "Wrong password",
      path: "password",
    });
  }
};

export const patchGroup = async (req, res, next) => {
  try {
    //그룹아이디 확인하고 해당하는 유저아이디 빼와서 아이디 패스워드 확인 이 맞는거같은데
    const groupId = req.params.groupId;
    const { ownerNickname, ownerPassword, ...updateData } = req.body;
    const newUpdateData = UnregistereGroup.formInfo(updateData);

    await verifyGroupOwner(groupId, ownerPassword);
    await prisma.group.update({
      where: { id: Number(groupId) },
      data: newUpdateData,
    });

    const newGroupInfo = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

    const result = formatGroupResponse(newGroupInfo);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { ownerPassword } = req.body;
    await verifyGroupOwner(groupId, ownerPassword);
    await prisma.$transaction(async (tx) => {
      await tx.workoutLog.deleteMany({
        where: { user: { group_id: BigInt(groupId) } },
      });

      await tx.owner.deleteMany({
        where: { group_id: BigInt(groupId) },
      });

      await tx.user.deleteMany({
        where: { group_id: BigInt(groupId) },
      });

      await tx.group.delete({
        where: { id: BigInt(groupId) },
      });
    });

    res.status(200).send({ message: "그룹이 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};
