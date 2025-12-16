//src / middlewares / workout.middleware.js;

import { UnregisteredWorkoutRecord } from "../entities/workout-log.js";
import { BadRequestError } from "../errors/customError.js";

export const validateWorkoutRecord = (req, res, next) => {
  try {
    const {
      authorNickname,
      authorPassword,
      workoutType,
      description,
      time,
      distance,
      images,
    } = req.body;

    if (!authorNickname || !authorPassword) {
      throw new BadRequestError({
        message: "인증을 위한 닉네임과 비밀번호는 필수입니다.",
      });
    }

    UnregisteredWorkoutRecord.formInfo({
      exerciseType: workoutType,
      description,
      time,
      distance,
      photos: images,
    });

    next();
  } catch (error) {
    next(error);
  }
};
