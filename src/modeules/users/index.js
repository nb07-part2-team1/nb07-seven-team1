import bcrypt from "bcrypt";
import { prisma } from "../../../prisma/prisma.js";
import { User } from "../../../domain/user/user.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/customError.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;
    const user = User.create(null, name.toLowerCase(), password);
    await nameToCheck(user.name, req.params.group_id);

    const hashedPassword = await hashPassword(user.passowrd);

    await prisma.user.create({
      data: {
        name: user.name,
        password: hashedPassword,
        group_id: req.params.groupId,
      },
    });
    res.json("User create ok");
  } catch (e) {
    next(e);
  }
};

async function nameToCheck(name, groupId) {
  const user = await prisma.user.findFirst({
    where: {
      name: name,
      group_id: groupId,
    },
  });
  if (user) {
    throw new ConflictError("중복된 닉네임 입니다");
  }

  return;
}

async function hashPassword(password) {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

export const deleteUser = async (req, res, next) => {
  try {
    const { name, password } = req.body;

    const getUser = await findUser(name, password, req.params.groupId);
    const user = User.create(getUser.id, getUser.name, getUser.password);

    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
    res.json({ message: "그룹 참여를 취소하였습니다" });
  } catch (e) {
    next(e);
  }
};

//[그룹 운동 기록 생성] 담당에서 구현될 것 같아서 [보류]
// export const userToParticipate = async (req, res, next) => {
//   const { name, password } = req.body;

//   const getUser = await findUser(name, req.params.groupId);

//   if (!getUser) {
//     throw new NotFoundError("닉네임을 확인해주세요");
//   }
//   if (getUser.name === name && getUser.password !== password) {
//     throw new UnauthorizedError("비밀번호를 확인해주세요");
//   }

//   const user = User.create(getUser.id, getUser.name, getUser.password);

//   res.json({ message: "userToParticipate" });
// };

async function findUser(name, password, groupId) {
  const findUser = await prisma.user.findFirst({
    where: {
      name,
      group_id: groupId,
    },
  });

  const isMatch = await verifyPassword(password, findUser.password);

  if (!findUser) {
    throw new NotFoundError("닉네임을 확인해주세요");
  }
  if (findUser.name === name && !isMatch) {
    throw new UnauthorizedError("비밀번호를 확인해주세요");
  }

  return findUser;
}

async function verifyPassword(inputPassword, hashedPassword) {
  return await bcrypt.compare(inputPassword, hashedPassword);
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
