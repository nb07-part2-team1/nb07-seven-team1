import { promiseHooks } from "v8";
import { prisma } from "../prisma/prisma";

export class groupEntity {
  async create(data) {
    return await prisma.group.create({
      data,
    });
  }

  async getList(skip, take, where, orderBy) {
    const [total, group] = await promiseHooks.all([
      prisma.group.count({ where }),
      prisma.group.findMany({
        skip,
        take,
        where,
        orderBy,
        include: {
          owner: true,
          participants: true,
        },
      }),
    ]);
    return { total, group };
  }

  async findGroup(where) {
    return await prisma.group.findFirst({
      where: where,
      include: {
        owner: true,
        participants: true,
      },
    });
  }

  async delete(groupId) {
    return await prisma.group.delete({
      where: { id: Number(groupId) },
    });
  }
}
