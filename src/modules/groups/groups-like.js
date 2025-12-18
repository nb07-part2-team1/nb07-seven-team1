import { prisma } from "../../../prisma/prisma.js";
import { NotFoundError } from "../../errors/customError.js";
import { likeBadge } from "./groups-badge.js";

export const likeGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }

    await prisma.group.update({
      where: { id: groupId },
      data: {
        like_count: {
          increment: 1,
        },
      },
    });

    await likeBadge(groupId);

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};

export const unlikeGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true, like_count: true },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }

    if (group.like_count > 0) {
      await prisma.group.update({
        where: { id: groupId },
        data: {
          like_count: { decrement: 1 },
        },
      });
    }

    return res.sendStatus(200);
  } catch (err) {
    next(err);
  }
};
