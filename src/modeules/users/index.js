import { prisma } from "../../../prisma/prisma.js";
import { User } from "../../../domain/user/user.js";
import { ConflictError } from "../../errors/customError.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = User.create(name, password);

    nicknameCheck(user.name, req.params.group_id);
    if (nicknameCheck) {
      throw new ConflictError("중복된 닉네임 입니다");
    }

    await prisma.user.create({
      data: {
        name: user.name,
        password: user.passowrd,
        group_id: req.params.groupId,
      },
    });
    res.json("User create ok");
  } catch (e) {
    next(e);
  }
};

async function nicknameCheck(name, groupId) {
  const nicknameCheck = await prisma.user.findFirst({
    where: {
      name: name,
      group_id: groupId,
    },
  });

  return nicknameCheck ? true : false;
}

export const createOwner = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const user = await prisma.user.create({
      data: {
        name,
        password,
        // group_id: req.params.groupId, //group create에 맞춰서 변경 필요
      },
    });

    const owner = await prisma.owner.create({
      data: {
        user_id: user.id,
        //group_id: group.id, //group create에 맞춰서 변경 필요
      },
    });

    res.json("user create ok");
  } catch (e) {
    next(e);
  }
};
