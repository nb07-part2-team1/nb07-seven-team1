import { PrismaClient } from "@prisma/client";
import { entityGroup } from "../../entitys/groupEntitys.js";
import { NotFoundError, UnauthorizedError } from "../../errors/customError.js";
const prisma = new PrismaClient();

export const createGroup = async (req, res, next) => {
  try {
    const groupEntity = new entityGroup(req.body);
    groupEntity.validate();
    const newGroup = await prisma.group.create({
      data: {
        owner_id: groupEntity.ownerId,
        ownerNickname: groupEntity.ownerNickname,
        name: groupEntity.name,
        tags: groupEntity.tags,
        goalRep: groupEntity.goalRep,
        photoUrl: groupEntity.photoUrl,
        password: groupEntity.password,
        description: groupEntity.description,
        discordWebhookUrl: groupEntity.discordWebhookUrl,
        discordInviteUrl: groupEntity.discordInviteUrl,
        like_count: 0,
        participantCount: 1,
      },
    });

    const responseEntity = new entityGroup({
      ...newGroup,
      owner: {
        id: groupEntity.ownerId,
        nickname: groupEntity.ownerNickname,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(201).send(responseEntity.toResponse());
  } catch (error) {
    next(error);
  }
};

export const getGroup = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, sortBy, keyword } = req.query;
    let orderBy;

    switch (sortBy) {
      case "mostlike":
        orderBy = { like_count: "desc" };
        break;
      case "mostBadges":
        orderBy = { participantCount: "desc" };
        break;
      case "latest":
      default:
        orderBy = { createdAt: "desc" };
    }

    const where = keyword ? { name: { contains: keyword } } : {};

    const [total, groups] = await Promise.all([
      prisma.group.count({ where }),
      prisma.group.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        where,
        orderBy,
        include: {
          owner: true,
          participants: true,
        },
      }),
    ]);

    const formattedData = groups.map((group) => {
      return new entityGroup(group).toResponse();
    });

    res.status(200).send({
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(pageSize)),
      data: formattedData,
    });
  } catch (error) {
    next(error);
  }
};

export const getGroupDetail = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const groupData = await prisma.group.findUnique({
      where: { id: Number(groupId) },
      include: {
        owner: true,
        participants: true,
      },
    });

    if (!groupData) {
      throw new NotFoundError("그룹을 찾을 수 없음.");
    }

    const groupEntity = new entityGroup(groupData);

    res.status(200).send(groupEntity.toResponse());
  } catch (error) {
    next(error);
  }
};

export const patchGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { password, ...dataToUpdate } = req.body;

    const rawData = await prisma.group.findUnique({
      where: { id: Number(groupId) },
    });
    if (!rawData) throw new NotFoundError("존재하지않는 그룹.");

    const groupEntity = new entityGroup(rawData);
    groupEntity.validatePassword(password);

    const updatedGroup = await prisma.group.update({
      where: { id: Number(groupId) },
      data: dataToUpdate,
      include: {
        owner: true,
        participants: true,
      },
    });

    const updatedEntity = new entityGroup(updatedGroup);
    res.status(200).send(updatedEntity.toResponse());
  } catch (error) {
    next(error);
  }
};

export const deleteGroup = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { ownerPassword } = req.body;

    const rawData = await prisma.group.findUnique({
      where: { id: Number(groupId) },
    });
    if (!rawData) {
      throw new NotFoundError("그룹이 없습니다.");
    }
    const groupEntity = new entityGroup(rawData);
    if (!ownerPassword) {
      throw new UnauthorizedError("비밀번호를 입력하세요");
    }
    groupEntity.validatePassword(ownerPassword);

    await prisma.group.delete({
      where: { id: Number(groupId) },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
