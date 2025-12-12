//../modeules/groups/groups-workout.js

import { WorkoutRecord } from "./groups-workout-record.model.js";
import { prisma } from "../../../prisma/prisma.js";
import { NotFoundError, UnauthorizedError } from "../../errors/customError.js";
import { time } from "console";

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
    const user = await prisma.user.findFirst({
      where: { name: authorNickname },
      select: { id: true, password: true, group_id: true },
    });

    if (!user) {
      throw new NotFoundError("사용자 정보를 찾을 수 없습니다.");
    }
    if (authorPassword !== user.password) {
      throw new UnauthorizedError(
        "비밀번호가 일치하지 않아 인증에 실패했습니다."
      );
    }

    //workout record data 운동 기록 데이터
    const newRecord = await prisma.workoutLog.create({
      data: {
        category: workoutType,
        description: description || null,
        distance: Math.floor(distance),
        time: new Date(),
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

//상세 조회
// 운동 종류, 설명, 사진(여러장), 시간, 거리, 닉네임 조회가 가능합니다.
export const getRecordDetail = async (recordId) => {
  try {
    const record = await prisma.workoutLog.findUnique({
      where: { id: BigInt(recordId) },
    });

    if (!record) {
      throw new NotFoundError("해당 운동 기록을 찾을 수 없습니다.");
    }

    return WorkoutRecord.fromEntity(record);
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
    sort === "time" ? { time: "desc" } : { created_at: "desc" };
  const whereCondition = {
    user: {
      group_id: BigInt(groupId),
      ...(search && { name: { contains: search, mode: "insensitive" } }),
    },
  };
  // 닉네임으로 검색 가능합니다.
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
    throw new NotFoundError("해당 운동 기록을 찾을 수 없습니다.");
  }
  const groupUser = record.user;

  if (groupUser.name !== nickname || groupUser.password !== password) {
    throw new UnauthorizedError(
      "기록 작성자가 아니거나 비밀번호가 일치하지 않습니다."
    );
  }

  const updatedRecord = await prisma.workoutLog.update({
    where: { id: BigInt(recordId) },
    data: {
      description: updateData.description,
      time: new Date(),
      distance: Math.floor(updateData.distance),
      images: updateData.images,
    },
    include: { user: true },
  });

  return WorkoutRecord.fromEntity(updatedRecord);
};

//운동 기록 삭제
export const deleteRecord = async (recordId, nickname, password) => {
  try {
    const record = await prisma.workoutLog.findUnique({
      where: { id: BigInt(recordId) },
      include: { user: true },
    });
    if (!record) {
      throw new NotFoundError("해당 운동 기록을 찾을 수 없습니다.");
    }
    const groupUser = record.user;

    if (groupUser.name !== nickname || groupUser.password !== password) {
      throw new UnauthorizedError(
        "기록 작성자가 아니거나 비밀번호가 일치하지 않습니다."
      );
    }

    await prisma.workoutLog.delete({ where: { id: BigInt(recordId) } });
    return { message: "RecordDeleted" };
  } catch (error) {
    throw error;
  }
};
