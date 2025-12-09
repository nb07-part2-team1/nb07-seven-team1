//../modeules/groups/groups-workout.js

import { WorkoutRecord } from "./workout-record.model.js";
import prisma from "../../prisma/prisma.js";

// 기록 생성
//닉네임, 운동 종류(달리기, 자전거, 수영),
//설명, 시간, 거리, 사진(여러장 가능), 비밀번호를 입력하여 운동 기록을 등록합니다.
export const createRecord = async (recordData) => {
  const {
    authorNickname,
    workoutType,
    description,
    time,
    distance,
    images,
    authorPassword,
  } = recordData;

  try {
    // 1. 사용자 인증 및 그룹 등록 유저 확인
    // 닉네임, 비밀번호를 확인하여 그룹에 등록된 유저일 때만 기록 등록이 가능합니다.
    const user = await prisma.user.findUnique({
      where: { name: authorNickname },
      select: { id: true, password: true, group_id: true },
    });

    if (!user) {
      throw new Error("UserNotFound");
    }
    if (authorPassword !== user.password) {
      throw new Error("InvalidPassword");
    }

    //workout record data 운동 기록 데이터
    const newRecord = await prisma.workoutLog.create({
      data: {
        category: workoutType,
        description: description || null,
        time: new Date(),
        duration_seconds: time,
        distance: distance,
        images: images || [],
        user_id: user.id,
      },
      include: { user: true },
    });

    try {
      await sendDiscordNotification(newRecord, user.group_id);
    } catch (e) {
      console.error(e);
    }
    return WorkoutRecord.fromEntity(newRecord);
  } catch (error) {
    throw error;
  }
};

//운동기록 목록 조회
// 그룹 내에 등록된 모든 유저의 운동 기록 조회가 가능합니다.
// 닉네임, 운동 종류, 시간, 거리, 사진이 표시됩니다.
// 최신순, 운동시간순으로 정렬 가능합니다.
// 닉네임으로 검색 가능합니다.
// 페이지네이션이 가능합니다.
export const getRecords = async (query) => {
  const { groupId, sort = "latest", search = "", page = 1, limit = 10 } = query;
  const parsedPage = parseInt(page) > 0 ? parseInt(page) : 1;
  const parsedLimit =
    parseInt(limit) > 0 && parseInt(limit) <= 50 ? parseInt(limit) : 10;
  const skip = (parsedPage - 1) * parsedLimit;

  let orderByCondition =
    sort === "time" ? { duration_seconds: "desc" } : { created_at: "desc" };
  const whereCondition = {
    user: {
      group_id: BigInt(groupId),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
  };

  try {
    const totalRecords = await prisma.workoutLog.count({
      where: whereCondition,
    });
    const records = await prisma.workoutLog.findMany({
      where: whereCondition,
      orderBy: orderByCondition,
      skip: skip,
      take: parsedLimit,
      include: { user: { select: { name: true } } },
    });

    // ✅ 도메인 모델을 사용하여 DB 엔티티를 API 응답 형식으로 포맷팅
    return {
      records: records.map((record) => WorkoutRecord.fromEntity(record)),
      pagination: {
        totalItems: totalRecords,
        totalPages: Math.ceil(totalRecords / parsedLimit),
        currentPage: parsedPage,
        limit: parsedLimit,
      },
    };
  } catch (error) {
    throw error;
  }
};

//운동 기록 수정
export const updateRecord = async (
  recordId,
  updateData,
  nickname,
  password
) => {
  const record = await prisma.workoutLog.findUnique({
    where: { id: BigInt(recordId) },
    include: { user: true },
  });
  if (!record) {
    throw new Error("RecordNotFound");
  }
  const owner = record.user;

  if (owner.name !== nickname || owner.password !== password) {
    throw new Error("UnauthorizedAccess");
  }

  const updatedRecord = await prisma.workoutLog.update({
    where: { id: BigInt(recordId) },
    data: {
      description: updateData.description,
      duration_seconds: updateData.time,
      distance: updateData.distance,
      images: updateData.images,
    },
    include: { user: true },
  });

  return WorkoutRecord.fromEntity(updatedRecord);
};

//운동 기록 삭제
export const deleteRecord = async (recordId, nickname, password) => {
  const record = await prisma.workoutLog.findUnique({
    where: { id: BigInt(recordId) },
    include: { user: true },
  });
  if (!record) {
    throw new Error("RecordNotFound");
  }
  const owner = record.user;

  if (owner.name !== nickname || owner.password !== password) {
    throw new Error("UnauthorizedAccess");
  }

  await prisma.workoutLog.delete({ where: { id: BigInt(recordId) } });
  return { message: "RecordDeleted" };
};
