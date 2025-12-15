import { prisma } from "../../prisma/prisma.js";
import { checkJoinGroup, checkMember, checkNickname } from "../../utils/auth.js";
import { participantsBadge } from "./groups-badge.js";

export const joinGroup = async (req, res, next) => {
  try {
    const { groupIdBigInt, nickname, password } = checkJoinGroup(
      req.params.groupId,
      req.body.nickname,
      req.body.password
    );

    await checkNickname(groupIdBigInt, nickname);
 
    await prisma.user.create({
      data: {
        group_id: groupIdBigInt,
        name: nickname,
        password,
      },
    });

    await participantsBadge(groupIdBigInt);

    const updatedGroup = await prisma.group.findUnique({
      where: { id: groupIdBigInt },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

    return res.status(201).json(updatedGroup);
  } catch (err) {
    next(err);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    const { groupIdBigInt, nickname, password } = checkJoinGroup(
      req.params.groupId,
      req.body.nickname,
      req.body.password
    );

    const user = await checkMember(groupIdBigInt, nickname, password);
    
    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
