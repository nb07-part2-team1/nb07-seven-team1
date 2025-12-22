import { UnregistereGroup } from "../../entities/group.js";
import { prisma } from "../../../prisma/prisma.js";
import { UnregisteredUser, User } from "../../entities/user.js";
import { UnauthorizedError } from "../../errors/customError.js";
import BaseController from "../base.controller.js";

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

class GroupMainController {
  // 그룹 생성
  createGroup = BaseController.handle(async (req, res) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
      const createGroupInfo = UnregistereGroup.formInfo(req.body);

      const createdGroup = await prisma.group.create({
        data: { ...createGroupInfo, like_count: 0 },
      });

      const createOwnerInfo = UnregisteredUser.formInfo({
        name: req.body.ownerNickname,
        password: req.body.ownerPassword,
        groupId: createdGroup.id,
        ownerCheck: true,
      });

      const inputUser = await prisma.user.create({
        data: createOwnerInfo,
      });

      return { createdGroup, inputUser };
    });

    await prisma.owner.create({
      data: {
        user_id: transactionResult.inputUser.id,
        group_id: transactionResult.createdGroup.id,
      },
    });

    const newGroupInfo = await prisma.group.findUnique({
      where: { id: transactionResult.createdGroup.id },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });
    const result = formatGroupResponse(newGroupInfo);

    res.status(201).json(result);
  });
  // 그룹 목록 가져오기
  getGroups = BaseController.handle(async (req, res) => {
    const { page = 1, limit = 10, order, orderBy, search } = req.query;
    const newOrderBy = getOrderBy(orderBy, order);
    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const [groups, groupCount] = await Promise.all([
      prisma.group.findMany({
        where: where,
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit),
        orderBy: newOrderBy,
        include: {
          owner: true,
          users: true,
          badges: true,
        },
      }),
      prisma.group.count({ where: where }),
    ]);

    const result = groups.map((group) => formatGroupResponse(group));

    res.status(200).json({ data: result, total: groupCount });
  });

  // 그룹 상세정보 가져오기
  getGroup = BaseController.handle(async (req, res) => {
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
  });

  // 그룹 수정
  updateGroup = BaseController.handle(async (req, res) => {
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
  });

  // 그룹 삭제
  deleteGroup = BaseController.handle(async (req, res) => {
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

    res.status(200).send({ ownerPassword });
  });
}

export default new GroupMainController();
