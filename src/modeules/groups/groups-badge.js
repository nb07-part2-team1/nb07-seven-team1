import { prisma } from "../../prisma/prisma.js";
import { badgeContent, badgeThreshold } from "../../constants/badge.js";

const ensureBadge = async (groupIdBigInt, content) => {
  const exists = await prisma.badge.findFirst({
    where: { group_id: groupIdBigInt, content },
    select: { id: true },
  });

  if (exists) return;

  await prisma.badge.create({
    data: { group_id: groupIdBigInt, content },
  });
};

// 배지: 참여자 10명 이상 (조건 충족 시에만 생성)
export const participantsBadge = async (groupIdBigInt) => {
  const count = await prisma.user.count({
    where: { group_id: groupIdBigInt },
  });

  if (count < badgeThreshold.participantsBadge10) return;

  await ensureBadge(groupIdBigInt, badgeContent.participantsBadge10);
};

// 배지: 추천수 100 이상
export const likeBadge = async (groupIdBigInt) => {
  const group = await prisma.group.findUnique({
    where: { id: groupIdBigInt },
    select: { like_count: true },
  });

  if (!group) return;
  if (group.like_count < badgeThreshold.likesBadge100) return;

  await ensureBadge(groupIdBigInt, badgeContent.likesBadge100);
};

// 배지: 운동 기록 100개 이상
export const workoutBadge = async (groupIdBigInt) => {
  const count = await prisma.workoutLog.count({
    where: { user: { group_id: groupIdBigInt } },
  });

  if (count < badgeThreshold.workoutsBadge100) return;

  await ensureBadge(groupIdBigInt, badgeContent.workoutsBadge100);
};
