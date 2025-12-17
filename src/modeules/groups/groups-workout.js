//../modeules/groups/groups-workout.js
import { prisma } from "../../../prisma/prisma.js";
import { UnregistereWorkoutRecord } from "../../entities/workout-log.js";
import { NotFoundError, UnauthorizedError } from "../../errors/customError.js";

// 기록 생성
export const createRecord = async (req, res, next) => {
  try {
    const { authorNickname, authorPassword, ...recordData } = req.body;

    const validatedRecord = UnregistereWorkoutRecord.formInfo({
      exerciseType: recordData.exerciseType,
      description: recordData.description,
      time: recordData.time,
      distance: recordData.distance,
      photos: recordData.photos,
    });

    const user = await prisma.user.findFirst({
      where: { name: authorNickname },
      select: { id: true, password: true },
    });

    if (!user || authorPassword !== user.password) {
      throw new UnauthorizedError(
        "비밀번호가 일치하지 않아 인증에 실패했습니다."
      );
    }

    const newRecord = await prisma.workoutLog.create({
      data: {
        category: validatedRecord.exerciseType || recordData.exerciseType,
        description: validatedRecord.description,
        distance: validatedRecord.distance,
        time: validatedRecord.time,
        images: validatedRecord.images,
        user_id: user.id,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    const responsePayload = {
      id: Number(newRecord.id),
      exerciseType: newRecord.category,
      description: newRecord.description,
      time: newRecord.time,
      distance: newRecord.distance,
      photos: Array.isArray(newRecord.images) ? newRecord.images : [],
      author: {
        id: Number(newRecord.user.id),
        nickname: newRecord.user.name,
      },
    };

    console.log(JSON.stringify(responsePayload, null, 2));

    return res.status(201).json({
      message: "운동 기록이 성공적으로 등록되었습니다.",
      record: {
        id: newRecord.id.toString(),
        exerciseType: newRecord.category,
        author: {
          id: newRecord.user.id.toString(),
          nickname: newRecord.user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//상세 조회
// // 운동 종류, 설명, 사진(여러장), 시간, 거리, 닉네임 조회가 가능합니다.
// 그룹명, 설명, 닉네임, 사진, 태그, 목표 횟수, 참여자 수, 디스코드 서버 초대 URL을 조회합니다.
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

    const group = record.user.group;

    const responsePayload = {
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
      group: {
        name: group.name,
        description: group.description,
        tags: group.tags,
        goalReps: group.goal_reps,
        discordServerUrl: group.discord_server_url,
        participantsCount: group.users.length,
      },
    };

    console.log("기록 상세 조회 결과");
    console.log(JSON.stringify(responsePayload, null, 2));

    return res.status(200).json(responsePayload);
  } catch (error) {
    console.error("상세 조회 에러:", error.message);
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

    let orderByCondition = { created_at: "desc" };
    ``;
    if (sort === "time") orderByCondition = { time: "desc" };

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

    const recordsData = recordLows.map((record) => ({
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
    }));

    const responsePayload = {
      data: recordsData,
      total: totalCount,
    };
    console.log(JSON.stringify(responsePayload, null, 2));

    return res.status(200).json({
      data: recordsData,
      total: totalCount,
    });
  } catch (error) {
    next(error);
  }
};

// 운동 기록 수정
// 비밀번호를 입력하여 그룹 등록 시 입력했던 비밀번호와 일치할 경우 그룹 수정이 가능합니다.
export const updateRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const { authorNickname, authorPassword, ...updateData } = req.body;

    const record = await prisma.workoutLog.findUnique({
      where: { id: BigInt(recordId) },
      include: { user: { select: { name: true, password: true } } },
    });

    if (!record) throw new NotFoundError("해당 운동 기록을 찾을 수 없습니다.");
    if (
      record.user.name !== authorNickname ||
      record.user.password !== authorPassword
    ) {
      throw new UnauthorizedError(
        "비밀번호가 일치하지 않아 수정할 수 없습니다."
      );
    }

    const validatedUpdateData = UnregistereWorkoutRecord.formInfo({
      exerciseType: updateData.exerciseType,
      description: updateData.description,
      time: updateData.time,
      distance: updateData.distance,
      photos: updateData.photos,
    });

    const updatedRecord = await prisma.workoutLog.update({
      where: { id: BigInt(recordId) },
      data: {
        category: validatedUpdateData.category,
        description: validatedUpdateData.description,
        time: validatedUpdateData.time,
        distance: validatedUpdateData.distance,
        images: validatedUpdateData.images,
      },
      include: { user: { select: { id: true, name: true } } },
    });

    return res.status(200).json({
      message: "운동 기록이 성공적으로 수정되었습니다.",
      record: {
        id: updatedRecord.id.toString(),
        exerciseType: updatedRecord.category,
        author: {
          id: updatedRecord.user.id.toString(),
          nickname: updatedRecord.user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

//운동 기록 삭제
// 비밀번호를 입력하여 그룹 등록 시 입력했던 비밀번호와 일치할 경우 그룹 삭제가 가능합니다.

export const deleteRecord = async (req, res, next) => {
  try {
    const { recordId } = req.params;
    const { authorNickname, authorPassword } = req.body;

    const record = await prisma.workoutLog.findUnique({
      where: { id: BigInt(recordId) },
      include: { user: { select: { name: true, password: true } } },
    });

    if (!record) throw new NotFoundError("해당 운동 기록을 찾을 수 없습니다.");

    if (
      record.user.name !== authorNickname ||
      record.user.password !== authorPassword
    ) {
      throw new UnauthorizedError(
        "비밀번호가 일치하지 않아 삭제할 수 없습니다."
      );
    }

    await prisma.workoutLog.delete({ where: { id: BigInt(recordId) } });

    return res
      .status(200)
      .json({ message: "운동 기록이 성공적으로 삭제되었습니다." });
  } catch (error) {
    next(error);
  }
};
