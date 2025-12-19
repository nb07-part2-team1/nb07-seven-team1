import { prisma } from "../../prisma/prisma.js";
//참가 유저 생성
export const createUser = async ({ group_id, name, password }) => {
  return await prisma.user.create({
    data: {
      group_id,
      name,
      password,
    },
  });
};

//참가 유저 삭제
export const deleteUser = async (userId) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

// owner, users (password 제외), badges 정보 포함해서 group 조회
export const findGroupWithRelationsData = async (groupId) => {
  return await prisma.group.findUnique({
    where: { id: groupId },
    include: {
      owner: true,
      users: {
        select: {
          id: true,
          name: true,
          created_at: true,
          updated_at: true,
          group_id: true,
        },
      },
      badges: true,
    },
  });
};
