import {
  validateUnregisteredWorkoutRecord,
  validateWorkoutRecord,
} from "../utils/validators.js";

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
    const info = {
      id: parseInt(entity.id),
      exerciseType: entity.category,
      description: entity.description,
      time: entity.time,
      distance: entity.distance,
      photos: entity.images || [],
    };

    //검증 로직
    validateWorkoutRecord(info);

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
    const info = {
      catagory: exerciseType,
      description: description || "",
      time,
      distance: distance || 0,
      images: photos || [],
    };

    //검증 로직
    validateUnregisteredWorkoutRecord(info);

    return new UnregistereWorkoutRecord(info);
  }
}
