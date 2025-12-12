import {
  createUserInGroup,
  deleteUserInGroup,
  getGroup,
  getOwner,
} from "./users.service.js";
import { userResponse } from "./users.mapper.js";

export const createUser = async (req, res, next) => {
  try {
    const { nickname, password } = req.body;
    const { groupId } = req.params;

    const resUserData = await createUserInGroup({
      nickname,
      password,
      groupId,
    });
    const resGroupData = await getGroup(groupId);
    const resOwnerData = await getOwner(groupId);

    res.status(201).json(userResponse(resUserData, resGroupData, resOwnerData));
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
