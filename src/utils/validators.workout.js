import { BadRequestError } from "../errors/customError.js";

export const validateExerciseType = ({ value, path }) => {
  const exerciseTypes = ["러닝", "사이클링", "수영"];
  if (!exerciseTypes.includes(value)) {
    throw new BadRequestError({
      path,
      message: "존재하지 않는 운동 카테고리 입니다",
    });
  }
};
