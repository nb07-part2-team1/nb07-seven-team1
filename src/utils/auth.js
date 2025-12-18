import { prisma } from "../prisma/prisma.js";
import {
  NotFoundError,
  UnauthorizedError,
  ConflictError,
} from "../errors/customError.js";

export const checkMember = async (groupIdBigInt, name, password) => {
  const user = await prisma.user.findFirst({
    where: { group_id: groupIdBigInt, name },
    select: { id: true, name: true, password: true },
  });

  if (!user) throw new NotFoundError("해당 닉네임을 찾을 수 없습니다.");
  if (user.password !== password)
    throw new UnauthorizedError("비밀번호가 일치하지 않습니다.");

  return user;
};

export const checkNickname = async (groupIdBigInt, name) => {
  const exists = await prisma.user.findFirst({
    where: { group_id: groupIdBigInt, name },
    select: { id: true },
  });

  if (exists) throw new ConflictError("이미 사용 중인 닉네임입니다.");
};
