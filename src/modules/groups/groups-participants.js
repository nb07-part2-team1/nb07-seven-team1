import { prisma } from "../../../prisma/prisma.js";
import { Group } from "../../entities/group.js";
import { User } from "../../entities/user.js";
import { participantsBadge } from "./groups-badge.js";
import { checkMember, checkNickname } from "../../utils/auth.js";
import { NotFoundError } from "../../errors/customError.js";

export const joinGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    console.log("joinGroup called with:", { groupId, nickname, password });

    const group = await prisma.group.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }

    await checkNickname(groupId, nickname);

    await prisma.user.create({
      data: {
        name: nickname,
        password,
        group_id: groupId,
      },
    });

    await participantsBadge(groupId);

    const updatedGroup = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

    const groupEntity = Group.formEntity(updatedGroup);

    return res.status(200).json({
      ...groupEntity,
    });
  } catch (err) {
    next(err);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }

    const user = await checkMember(groupId, nickname, password); // { id, name, password }

    await prisma.user.delete({
      where: { id: user.id },
    });

    const groupEntity = Group.formEntity(updatedGroup);

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
