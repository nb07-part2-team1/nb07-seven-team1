import { prisma } from "../../../prisma/prisma.js";
import { Group } from "../../entities/group.js";
import { UnregisteredUser, User } from "../../entities/user.js";
import { participantsBadge } from "./groups-badge.js";
import {
  createUser,
  deleteUser,
  findGroupWithRelationsData,
} from "../../utils/groups-participants.creator.js";
import {
  checkMember,
  checkNickname,
  existGroup,
  checkOwner,
} from "../../utils/groups-participants.auth.js";

export const joinGroup = async (req, res, next) => {
  try {
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

    // 7. owner, users, badges 정보 포함해서 group 조회
    const groupWithRelations = await findGroupWithRelationsData(groupId);

    // 8. group 유효성 검사
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

    // 1. 존재하는 그룹인지 확인
    existGroup(groupId);

    // 2. 그룹의 참가 멤버인지 확인
    const user = await checkMember({ groupId, nickname, password });

    // 3. 방장인지 확인 (방장은 탈퇴할 수 없음)
    await checkOwner({
      group_id: user.group_id,
      user_id: user.id,
    });

    // 4. 참가 유저 삭제
    deleteUser(user.id);

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
