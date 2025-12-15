// src/services/groups-workout.service.js

import { prisma } from "../../prisma/prisma.js";
import { WorkoutRecord } from "../entities/groups-workout-record.entity.js";

export class GroupWorkoutService {
  async createWorkoutRecord(userId, createDto) {
    const dataToSave = createDto.toCreateObject(userId);

    try {
      //Prisma를 사용하여 DB에 데이터 생성 및 저장
      const newRecordEntity = await prisma.workoutLog.create({
        data: dataToSave,
        include: {
          user: true,
        },
      });

      //생성된 DB 엔티티를 클라이언트 응답용 WorkoutRecord 모델로 변환
      return WorkoutRecord.fromEntity(newRecordEntity);
    } catch (error) {
      console.error("운동 기록 생성 중 데이터베이스 오류 발생:", error);
      // DB 오류 발생 시 상위 레이어에서 처리할 수 있도록 에러
      throw new Error("운동 기록을 저장하는 데 실패했습니다.");
    }
  }
}

export const groupWorkoutService = new GroupWorkoutService();
