//../modeules/groups/groups-workout.js

import { prisma } from "../../../prisma/prisma.js";
import { UnregistereWorkoutRecord } from "../../entities/workout-log.js";
import { NotFoundError, UnauthorizedError } from "../../errors/customError.js";
import { workoutBadge } from "./groups-badge.js";

const convertExerciseTypeName = (exerciseType) => {
  switch (exerciseType) {
    case "run":
      return "달리기";
    case "swim":
      return "수영";
    case "bike":
      return "사이클링";
  }
};

const responseFormat = (record) => ({
  id: Number(record.id),
  exerciseType: record.category,
  description: record.description,
  time: record.time,
  distance: record.distance,
  photos: Array.isArray(record.images) ? record.images : [],
  author: {
    id: Number(record.user.id),
    nickname: record.user.name,
  },
});

// 기록 생성 /groups/:groupId/records
export const createRecord = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { authorNickname, authorPassword, ...recordData } = req.body;

    const validatedRecord = UnregistereWorkoutRecord.formInfo(recordData);

    const user = await prisma.user.findFirst({
      where: { name: authorNickname, group_id: BigInt(groupId) },
      select: { id: true, name: true, password: true },
    });

    if (!user || authorPassword !== user.password) {
      throw new UnauthorizedError(
        "비밀번호가 일치하지 않아 인증에 실패했습니다."
      );
    }

    const newRecord = await prisma.workoutLog.create({
      data: {
        category: validatedRecord.catagory,
        description: validatedRecord.description,
        distance: validatedRecord.distance,
        time: validatedRecord.time,
        images: validatedRecord.images,
        user_id: user.id,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    await workoutBadge(BigInt(groupId));

    //discord webhook message
    const groupInfo = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
    });

    const discordResponse = await fetch(groupInfo.discord_web_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `${user.name}님의 ${convertExerciseTypeName(recordData.exerciseType)} 운동 기록이 추가되었습니다.`,
      }),
    });

    const responsePayload = responseFormat(newRecord);

    return res.status(201).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

//상세 조회
export const getRecordDetail = async (req, res, next) => {
  try {
    const { recordId } = req.params;

    const record = await prisma.workoutLog.findUnique({
      where: { id: BigInt(recordId) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            group: {
              select: {
                name: true,
                description: true,
                tags: true,
                goal_reps: true,
                discord_server_url: true,
                users: { select: { id: true } },
              },
            },
          },
        },
      },
    });

    if (!record) throw new NotFoundError("해당 운동 기록을 찾을 수 없습니다.");

    const responsePayload = responseFormat(record);

    return res.status(200).json(responsePayload);
  } catch (error) {
    next(error);
  }
};

//운동기록 목록 조회
export const getRecords = async (req, res, next) => {
  try {
    const { groupId } = req.params;
    const { sort = "latest", search = "", page = 1, limit = 10 } = req.query;

    const parsedPage = Math.max(1, parseInt(page));
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (parsedPage - 1) * parsedLimit;

    const orderByCondition =
      sort === "time" ? { time: "desc" } : { created_at: "desc" };

    const whereCondition = {
      user: {
        group_id: BigInt(groupId),
        ...(search && { name: { contains: search, mode: "insensitive" } }),
      },
    };

    const [totalCount, recordLows] = await Promise.all([
      prisma.workoutLog.count({ where: whereCondition }),
      prisma.workoutLog.findMany({
        where: whereCondition,
        orderBy: orderByCondition,
        skip: skip,
        take: parsedLimit,
        include: { user: { select: { id: true, name: true } } },
      }),
    ]);

    const recordsData = recordLows.map((record) => responseFormat(record));

    const responsePayload = {
      data: recordsData,
      total: totalCount,
    };

    return res.status(200).json({
      data: recordsData,
      total: totalCount,
    });
  } catch (error) {
    next(error);
  }
};
