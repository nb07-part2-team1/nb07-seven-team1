import { prisma } from "../../prisma/prisma.js";

export const BADGE_CONTENT = {
  PARTICIPANTS_10: "참여자 10명 이상",
  LIKE_100: "추천수 100 이상",
  WORKOUT_100: "운동 기록 100개 이상",
};

// 배지 중복생성 방지
const createBadgeIfNotExists = async (groupIdBigInt, content) => {
  const exists = await prisma.badge.findFirst({
    where: {
      group_id: groupIdBigInt,
      content,
    },
    select: { id: true },
  });

  if (exists) return false;

  await prisma.badge.create({
    data: {
      group_id: groupIdBigInt,
      content,
    },
  });

  return true;
};

// 배지: 참여자 10명 이상
export const participantsBadge = async (groupIdBigInt) => {
  const count = await prisma.user.count({
    where: { group_id: groupIdBigInt },
  });

  if (count < 10) return false;

  return createBadgeIfNotExists(groupIdBigInt, BADGE_CONTENT.PARTICIPANTS_10);
};

// 배지: 추천수 100 이상
export const likeBadge = async (groupIdBigInt) => {
  const group = await prisma.group.findUnique({
    where: { id: groupIdBigInt },
    select: { like_count: true },
  });

  if (!group) return false;
  if (group.like_count < 100) return false;

  return createBadgeIfNotExists(groupIdBigInt, BADGE_CONTENT.LIKE_100);
};

// 배지: 운동 기록 100개 이상
export const workoutBadge = async (groupIdBigInt) => {
  const count = await prisma.workoutLog.count({
    where: {
      user: {
        group_id: groupIdBigInt,
      },
    },
  });

  if (count < 100) return false;

  return createBadgeIfNotExists(groupIdBigInt, BADGE_CONTENT.WORKOUT_100);
};
