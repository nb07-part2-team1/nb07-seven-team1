import { prisma } from "../../../prisma/prisma.js";
import { Group } from "../../entities/group.js";
import { UnregisteredUser, User } from "../../entities/user.js";
import { participantsBadge } from "./groups-badge.js";
import {
  checkMember,
  checkNickname,
  existGroup,
  checkOwner,
} from "../../utils/groups-participants.auth.js";
import BaseController from "../base.controller.js";

//참가 유저 생성
const createUser = async ({ group_id, name, password }) => {
  return await prisma.user.create({
    data: {
      group_id,
      name,
      password,
    },
  });
};

const formatGroupResponse = (group) => {
  const owner = group.users.find((user) => group.owner.user_id === user.id);
  const participants = group.users.map((user) => ({
    id: Number(user.id),
    nickname: user.name,
    createdAt: user.created_at.getTime(),
    updatedAt: user.updated_at.getTime(),
  }));
  const badges = group.badges.map((badge) => badge.content);

  return {
    id: Number(group.id),
    name: group.name,
    description: group.description,
    photoUrl: group.image ?? null,
    goalRep: group.goal_reps,
    discordWebhookUrl: group.discord_web_url,
    discordInviteUrl: group.discord_server_url,
    likeCount: group.like_count,
    tags: group.tags ?? [],
    owner: {
      id: Number(owner.id),
      nickname: owner.name,
      createdAt: owner.created_at.getTime(),
      updatedAt: owner.updated_at.getTime(),
    },
    participants,
    createdAt: group.created_at.getTime(),
    updatedAt: group.updated_at.getTime(),
    badges,
  };
};

//참가 유저 삭제
const deleteUser = async (userId) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};

class GroupParticipantsController {
  // 그룹 참가하기
  join = BaseController.handle(async (req, res) => {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    // 1. 존재하는 그룹인지 체크
    await existGroup(groupId);
    // 2. 닉네임 중복 체크
    await checkNickname({ groupId, nickname });

    // 3. 닉네임&비밀번호 유효성 검사
    const beforeVerificationUser = UnregisteredUser.formInfo({
      name: nickname,
      password,
      groupId,
    });
    // 4. 참가 유저 생성
    const participant = await createUser(beforeVerificationUser);

    // 5. DB 데이터 검증
    User.formEntity(participant);
    // 6. 그룹의 참여자 수 조회 (참여자 10명 이상이면 뱃지 부여)
    await participantsBadge(groupId);

    const newGroupInfo = await prisma.group.findUnique({
      where: { id: groupId },
      include: {
        owner: true,
        users: true,
        badges: true,
      },
    });

    if (newGroupInfo === null) {
      throw new NotFoundError({ message: "Group not found" });
    }

    const result = formatGroupResponse(newGroupInfo);

    return res.status(201).json(result);
  });

  // 그룹 떠나기
  leave = BaseController.handle(async (req, res) => {
    const groupId = BigInt(req.params.groupId);
    const { nickname, password } = req.body;

    // 1. 존재하는 그룹인지 확인
    await existGroup(groupId);

    // 2. 그룹의 참가 멤버인지 확인
    const user = await checkMember({ groupId, nickname, password });

    // 3. 방장인지 확인 (방장은 탈퇴할 수 없음)
    await checkOwner({
      group_id: user.group_id,
      user_id: user.id,
    });
    // 4. 참가 유저 삭제
    await deleteUser(user.id);

    return res.status(204).end();
  });
}

export default new GroupParticipantsController();
