<<<<<<< Updated upstream
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
=======
import { prisma } from "../../../prisma/prisma.js";
import { Group } from "../../entities/group.js";
import { User } from "../../entities/user.js";
import { participantsBadge } from "./groups-badge.js";
import { checkMember, checkNickname } from "../../utils/auth.js";
import { NotFoundError, BadRequestError } from "../../errors/customError.js";

export const joinGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

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
>>>>>>> Stashed changes
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

<<<<<<< Updated upstream
    return res.status(201).json(updatedGroup);
=======
    const groupEntity = Group.formEntity(updatedGroup);

    return res.status(200).json({
      ...groupEntity,
    });
>>>>>>> Stashed changes
  } catch (err) {
    next(err);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
<<<<<<< Updated upstream
    const { groupIdBigInt, nickname, password } = checkJoinGroup(
      req.params.groupId,
      req.body.nickname,
      req.body.password
    );

    const user = await checkMember(groupIdBigInt, nickname, password);
    
=======
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    const group = await prisma.group.findUnique({
      where: { id: groupId },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundError("존재하지 않는 그룹입니다.");
    }

    const user = await checkMember(groupId, nickname, password);

    // 오너 탈퇴 불가
    const owner = await prisma.owner.findUnique({
      where: { group_id: groupId },
      select: { user_id: true },
    });

    if (owner?.user_id === user.id) {
      throw new BadRequestError(
        "방장은 그룹을 탈퇴할 수 없습니다. 그룹 삭제를 이용해주세요."
      );
    }

>>>>>>> Stashed changes
    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
