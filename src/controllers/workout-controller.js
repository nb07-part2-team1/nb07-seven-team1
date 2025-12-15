// src/controllers/workout-controller.js

import { CreateWorkoutRecordDto } from "../dto/groups-workout-record.dto.js";
import { groupWorkoutService } from "../services/groups-workout.service.js";

export const createWorkoutRecordController = async (req, res, next) => {
  try {
    const { body } = req;
    const { workoutType, description, time, distance, images } = req.body;

    const exerciseType = workoutType;

    const dateObject = new Date(time);

    const createDto = new CreateWorkoutRecordDto(
      exerciseType,
      description,
      dateObject,
      distance,
      images
    );

    const userId = req.user.id;

    const newRecord = await groupWorkoutService.createWorkoutRecord(
      userId,
      createDto
    );

    res.status(201).json({
      message: "운동 기록이 성공적으로 생성되었습니다.",
      data: newRecord,
    });
  } catch (error) {
    next(error);
  }
};
