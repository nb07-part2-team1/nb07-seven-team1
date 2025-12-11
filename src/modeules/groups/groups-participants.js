import { prisma } from "../../prisma/prisma.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from "../../errors/customError.js";

// 그룹 참여
export const joinGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    const { nickname, password } = req.body;

    if (!Number.isInteger(groupId)) {
      throw new BadRequestError("잘못된 그룹 ID입니다.");
    }
    if (!nickname) {
      throw new BadRequestError("닉네임을 입력해주세요.");
    }
    if (!password) {
      throw new BadRequestError("비밀번호를 입력해주세요.");
    }

    const groupIdBigInt = BigInt(groupId);

    // 닉네임 중복x
    const exists = await prisma.user.findFirst({
      where: {
        group_id: groupIdBigInt,
        name: nickname,
      },
    });

    if (exists) {
      throw new ConflictError("이미 사용 중인 닉네임입니다.");
    }

    // 유저 생성
    await prisma.user.create({
      data: {
        name: nickname,
        password,
        group_id: groupIdBigInt,
      },
    });

    // 배지: 참여자 10명 이상
    const participantCount = await prisma.user.count({
      where: { group_id: groupIdBigInt },
    });

    if (participantCount >= 10) {
      const badgeExists = await prisma.badge.findFirst({
        where: {
          group_id: groupIdBigInt,
          content: "참여자 10명 이상",
        },
      });

      if (!badgeExists) {
        await prisma.badge.create({
          data: {
            group_id: groupIdBigInt,
            content: "참여자 10명 이상",
          },
        });
      }
    }

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

// 그룹 참여 취소
export const leaveGroup = async (req, res, next) => {
  try {
    const groupId = Number(req.params.groupId);
    const { nickname, password } = req.body;

    if (!Number.isInteger(groupId)) {
      throw new BadRequestError("잘못된 그룹 ID입니다.");
    }
    if (!nickname) {
      throw new BadRequestError("닉네임을 입력해주세요.");
    }
    if (!password) {
      throw new BadRequestError("비밀번호를 입력해주세요.");
    }

    const groupIdBigInt = BigInt(groupId);

    const user = await prisma.user.findFirst({
      where: {
        group_id: groupIdBigInt,
        name: nickname,
      },
    });

    if (!user) {
      throw new NotFoundError("해당 닉네임을 찾을 수 없습니다.");
    }

    if (user.password !== password) {
      throw new UnauthorizedError("비밀번호가 일치하지 않습니다.");
    }

    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
