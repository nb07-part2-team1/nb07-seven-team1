import { prisma } from "../../../prisma/prisma.js";
import { NotFoundError } from "../../errors/customError.js";
import BaseController from "../base.controller.js";
import { likeBadge } from "./groups-badge.js";

const updateLikeCount = async (groupId, isLike) => {
  return prisma.group.update({
    where: { id: groupId },
    data: {
      like_count: isLike ? { increment: 1 } : { decrement: 1 },
    },
  });
};

class GroupLikeController {
  // 좋아요
  like = BaseController.handle(async (req, res) => {
    const groupId = BigInt(req.params.groupId);
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }

    await updateLikeCount(groupId, true);
    await likeBadge(groupId);

    return res.sendStatus(200);
  });

  // 좋아요 취소
  unlike = BaseController.handle(async (req, res) => {
    const groupId = BigInt(req.params.groupId);
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true, like_count: true },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }
    if (group.like_count > 0) {
      await updateLikeCount(groupId, false);
    }

    return res.sendStatus(200);
  });
}

export default new GroupLikeController();
