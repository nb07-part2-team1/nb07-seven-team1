import { prisma } from "../../prisma/prisma.js";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../errors/customError.js";

export const checkMember = async ({ groupId, nickname, password }) => {
  const user = await prisma.user.findFirst({
    where: { groupId, nickname },
    select: { id: true, nickname: true, password: true },
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
