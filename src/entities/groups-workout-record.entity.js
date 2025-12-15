//../modeules/groups/groups-workout-record.entity.js

export class WorkoutRecord {
  constructor(
    id,
    nickname,
    workoutType,
    description,
    time,
    distance,
    images,
    createdAt
  ) {
    this.id = id;
    this.nickname = nickname;
    this.workoutType = workoutType;
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
      workoutType: entity.category,
      description: entity.description,
      time: entity.time,
      distance: entity.distance,
      images: entity.images || [],
      createdAt: entity.created_at,
    };

    return new WorkoutRecord(
      info.id,
      info.nickname,
      info.workoutType,
      info.description,
      info.time,
      info.distance,
      info.images,
      info.createdAt
    );
  }
}
