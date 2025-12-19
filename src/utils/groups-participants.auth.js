import { prisma } from "../../prisma/prisma.js";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
  BadRequestError,
} from "../errors/customError.js";

// 멤버 체크
export const checkMember = async ({ groupId, nickname, password }) => {
  const user = await prisma.user.findFirst({
    where: { group_id: groupId, name: nickname },
    select: { id: true, name: true, password: true },
  });

  if (!user) {
    throw new NotFoundError({
      message: "해당 닉네임을 찾을 수 없습니다",
      path: "nickname",
    });
  }
  if (user.name === nickname && user.password !== password) {
    throw new UnauthorizedError({
      message: "비밀번호가 일치하지 않습니다",
      path: "password",
    });
  }

  return user;
};

// 닉네임 체크
export const checkNickname = async ({ groupId, nickname }) => {
  const existsName = await prisma.user.findFirst({
    where: { group_id: groupId, name: nickname },
  });

  if (existsName)
    throw new ConflictError({
      message: "이미 사용 중인 닉네임입니다",
      path: "nickname",
    });
};

// 그룹 체크
export const existGroup = async (group_id) => {
  const getGroupId = await prisma.group.findUnique({
    where: { id: group_id },
    select: { id: true },
  });

  if (!getGroupId) {
    throw new NotFoundError("존재하지 않는 그룹입니다.");
  }
};

// 오너 체크
export const checkOwner = async ({ group_id, user_id }) => {
  const owner = await prisma.owner.findUnique({
    where: { group_id, user_id },
  });

  if (owner) {
    throw new BadRequestError({
      message: "방장은 그룹을 탈퇴할 수 없습니다",
      path: "owner",
    });
  }
};
