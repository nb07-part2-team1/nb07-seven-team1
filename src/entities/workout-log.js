import { BadRequestError } from "../errors/customError";

export class WorkoutRecord {
  constructor({ id, exerciseType, description, time, distance, photos }) {
    this.id = id;
    this.exerciseType = exerciseType;
    this.description = description;
    this.time = time;
    this.distance = distance;
    this.photos = photos;
  }

  static formEntity(entity) {
    // if (
    //   !entity ||
    //   !entity.id ||
    //   !entity.user ||
    //   !entity.category ||
    //   !entity.user.name
    // ) {
    //   throw new Error(
    //     "DB 엔티티 변환 중 필수 필드 또는 사용자 관계 정보가 누락되었습니다."
    //   );
    // }

    const info = {
      id: parseInt(entity.id),
      exerciseType: entity.category,
      description: entity.description,
      time: entity.time,
      distance: entity.distance,
      photos: entity.images || [],
    };

    // if (typeof nickname !== "string")
    return new WorkoutRecord(info);
  }
}

export class UnregistereWorkoutRecord {
  constructor({ catagory, description, time, distance, images }) {
    this.catagory = catagory;
    this.description = description;
    this.time = time;
    this.distance = distance;
    this.images = images;
  }

  static formInfo({ exerciseType, description, time, distance, photos }) {
    // // 타입 검증
    // if (
    //   !exerciseType ||
    //   typeof exerciseType !== "string" ||
    //   exerciseType.trim().length === 0
    // ) {
    //   throw new BadRequestError(
    //     "운동 종류(exerciseType)는 필수이며 공백이 아닌 문자열이어야 합니다."
    //   );
    // }
    // // 설명 검증
    // if (description !== undefined && typeof description !== "string") {
    //   throw new BadRequestError("설명(description)은 문자열이어야 합니다.");
    // }
    // if (!time) {
    //   throw new BadRequestError("시간(time)은 필수 입력값입니다.");
    // }

    // // 시간 유효성 검증
    // const timeObject = new Date(time);
    // if (isNaN(timeObject.getTime())) {
    //   throw new BadRequestError("유효하지 않은 시간(time) 형식입니다.");
    // }

    // // 거리 검증
    // if (distance !== undefined && distance !== null) {
    //   if (typeof distance !== "number" || distance < 0) {
    //     throw new BadRequestError(
    //       "거리(distance)는 0 이상의 숫자 형식이어야 합니다."
    //     );
    //   }
    // }
    // // images 배열 검증
    // if (photos !== undefined && photos !== null && !Array.isArray(photos)) {
    //   throw new BadRequestError("사진(photos)은 배열 형태여야 합니다.");
    // }

    const info = {
      catagory: exerciseType,
      description: description || "",
      time,
      distance: distance || 0,
      images: photos || [],
    };

    // 검증로직

    return new UnregistereWorkoutRecord(info);
  }
}
