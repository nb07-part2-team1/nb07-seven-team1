export class WorkoutRecord {
  constructor(
    id,
    nickname,
    exerciseType,
    description,
    time,
    distance,
    images,
    createdAt
  ) {
    this.id = id;
    this.nickname = nickname;
    this.exerciseType = exerciseType;
    this.description = description;
    this.time = time;
    this.distance = distance;
    this.images = images;
    this.createdAt = createdAt;
  }

  static fromEntity(entity) {
    const info = {
      id: entity.id.toString(),
      nickname: entity.user.name,
      exerciseType: entity.category,
      description: entity.description,
      time: entity.time,
      distance: entity.distance,
      images: entity.images || [],
      createdAt: entity.created_at,
    };

    if (typeof nickname !== "string")
      return new WorkoutRecord(
        info.id,
        info.nickname,
        info.exerciseType,
        info.description,
        info.time,
        info.distance,
        info.images,
        info.createdAt
      );
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
    const info = {
      catagory: exerciseType,
      description,
      time,
      distance,
      images: photos,
    };

    // 검증로직

    return new UnregistereWorkoutRecord(info);
  }
}
