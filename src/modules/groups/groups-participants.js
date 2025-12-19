import { prisma } from "../../../prisma/prisma.js";
import { Group } from "../../entities/group.js";
import { UnregisteredUser, User } from "../../entities/user.js";
import { participantsBadge } from "./groups-badge.js";
import { checkMember, checkNickname } from "../../utils/auth.js";
import { BadRequestError, NotFoundError } from "../../errors/customError.js";

//그룹 체크
const existGroup = async (group_id) => {
  const getGroupId = await prisma.group.findUnique({
    where: { id: group_id },
    select: { id: true },
  });

  if (!getGroupId) {
    throw new NotFoundError("존재하지 않는 그룹입니다.");
  }
};

//닉네임 생성
const createNickname = async ({ group_id, nickname, password }) => {
  const user = await prisma.user.create({
    data: {
      group_id,
      name: nickname,
      password,
    },
  });

  return user;
};

//오너 체크
const checkOwner = async ({ group_id, user_id }) => {
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

export const joinGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    // 존재하는 그룹인지 체크
    await existGroup(groupId);

    // 닉네임 중복 체크
    await checkNickname({ groupId, nickname });

    // 닉네임&비밀번호 검증
    const beforeVerificationUser = UnregisteredUser.formInfo({
      name: nickname,
      password,
      groupId,
    });

    // 닉네임 생성
    const createUser = await createNickname({
      group_id: beforeVerificationUser.group_id,
      nickname: beforeVerificationUser.name,
      password: beforeVerificationUser.password,
    });

    // DB 데이터 검증
    User.formEntity(createUser);

    // 그룹의 참여자 수 조회 (참여자 10명 이상이면 뱃지 부여)
    await participantsBadge(groupId);

    // owner, users, badges 정보 포함해서 group 조회
    const groupWithRelations = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

    const groupEntity = Group.formEntity(groupWithRelations);

    return res.status(200).json({
      ...groupEntity,
    });
  } catch (err) {
    next(err);
  }
};

export const leaveGroup = async (req, res, next) => {
  try {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    // 존재하는 그룹인지 체크
    existGroup(groupId);

    // 그룹의 참가 멤버인지 체크
    const user = await checkMember({ groupId, nickname, password });

    // 방장 체크 (방장은 탈퇴할 수 없음)
    await checkOwner({
      group_id: user.group_id,
      user_id: user.id,
    });

    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
