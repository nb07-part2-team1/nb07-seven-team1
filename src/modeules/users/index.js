import { createUserInGroup, deleteUserInGroup } from "./users.service.js";
import { userResponse } from "./users.mapper.js";
import bcrypt from "bcrypt";
import prisma from "../../../prisma/prisma.js";
import { User } from "../../../domain/user/user.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../errors/customError.js";

export const createUser = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const { groupId } = req.params;

    const resUserData = await createUserInGroup({
      nickname,
      password,
      groupId,
    });

    res.status(201).json(userResponse(resUserData));
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const { groupId } = req.params;

    await deleteUserInGroup({
      nickname,
      password,
      groupId,
    });

    res.json({ message: "그룹 참여를 취소하였습니다" });
  } catch (e) {
    next(e);
  }
};
