// ../src/middlewares/workout.middleware.js

import { BadRequestError } from "../errors/customError.js";
//기록되는 운동 3가지 defination
const recordingWorkoutType = ["run", "bicycle", "swim"];

export const validateWorkoutRecord = (req, res, next) => {
  const {
    authorNickname,
    workoutType,
    description,
    time,
    distance,
    images,
    authorPassword,
  } = req.body;

  const validationErrors = [];

  if (!authorNickname) {
    validationErrors.push({
      path: "authorNickname",
      message: "닉네임은 필수 항목입니다.",
    });
  }
  if (!authorPassword) {
    validationErrors.push({
      path: "authorPassword",
      message: "비밀번호는 필수 항목입니다.",
    });
  }
  if (!workoutType) {
    validationErrors.push({
      path: "workoutType",
      message: "운동 종류는 필수 항목입니다.",
    });
  }
  if (time === undefined) {
    validationErrors.push({
      path: "time",
      message: "운동 시간은 필수 항목입니다.",
    });
  }
  if (distance === undefined) {
    validationErrors.push({
      path: "distance",
      message: "거리는 필수 항목입니다.",
    });
  }

  if (
    authorNickname &&
    (typeof authorNickname !== "string" || authorNickname.trim().length === 0)
  ) {
    validationErrors.push({
      path: "authorNickname",
      message: "닉네임은 공백이 아닌 유효한 문자열이어야 합니다.",
    });
  }

  if (
    authorPassword &&
    (typeof authorPassword !== "string" || authorPassword.trim().length === 0)
  ) {
    validationErrors.push({
      path: "authorPassword",
      message: "비밀번호는 공백이 아닌 유효한 문자열이어야 합니다.",
    });
  }

  if (time !== undefined && (typeof time !== "number" || time < 0)) {
    validationErrors.push({
      path: "time",
      message: "운동 시간은 0 이상의 유효한 숫자(초)여야 합니다.",
    });
  }
  if (
    distance !== undefined &&
    (typeof distance !== "number" || distance < 0)
  ) {
    validationErrors.push({
      path: "distance",
      message: "거리는 0 이상의 유효한 숫자여야 합니다.",
    });
  }

  if (workoutType && !recordingWorkoutType.includes(workoutType)) {
    validationErrors.push({
      path: "workoutType",
      message: `유효하지 않은 운동 종류입니다. 허용된 종류: ${recordingWorkoutType.join(", ")}`,
    });
  }

  if (description !== undefined && typeof description !== "string") {
    validationErrors.push({
      path: "description",
      message: "설명은 문자열 타입이어야 합니다.",
    });
  }

  if (
    images !== undefined &&
    (!Array.isArray(images) || !images.every((img) => typeof img === "string"))
  ) {
    validationErrors.push({
      path: "images",
      message: "사진은 문자열 URL로 구성된 배열이어야 합니다.",
    });
  }

  if (validationErrors.length > 0) {
    throw new BadRequestError({
      message: "요청 데이터의 유효성 검사에 실패했습니다.",
      errors: validationErrors,
    });
  }
  next();
};
