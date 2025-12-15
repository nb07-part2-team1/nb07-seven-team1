//../src/dto/groups-workout-record.dto.js

import { BadRequestError } from "../errors/customError";

export class CreateWorkoutRecordDto {
  constructor(exerciseType, description, time, distance, images) {
    this.category = exerciseType;
    this.description = description;
    this.time = time;
    this.distance = distance;
    this.images = images;
  }

  static fromInfo({ workoutType, description, time, distance, images }) {
    const dateObject = new Date(time);

    if (typeof workoutType !== "string") {
      throw new BadRequestError(
        "운동 종류(workoutType) 타입이 문자열이 아닙니다."
      );
    }

    return new CreateWorkoutRecordDto({
      exerciseType: workoutType,
      description,
      time: dateObject,
      distance,
      images,
    });
  }

  //db구조에 저장하기 위한 구조로 변환
  toCreateObject(userId) {
    return {
      category: this.category,
      description: this.description,
      time: this.time,
      distance: this.distance,
      images: this.images,
      user_id: userId,
    };
  }
}
