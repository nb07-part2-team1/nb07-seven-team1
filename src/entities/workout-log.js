import {
  validateRequired,
  validatePositiveInteger,
  validateString,
  validateTime,
  validateArray,
  validateWhitespace,
} from "../utils/validators.common.js";

import { validateExerciseType } from "../utils/validators.workout.js";

//WorkoutRecord 검증
const validateWorkoutRecord = ({
  exerciseType,
  description,
  time,
  distance,
  photos,
}) => {
  validateWorkoutRecordExerciseType(exerciseType);
  validateWorkoutRecordDescription(description);
  validateWorkoutRecordTime(time);
  validateWorkoutRecordDistance(distance);
  validateWorkoutRecordPhotos(photos);
};
const validateWorkoutRecordExerciseType = (exerciseType) => {
  const validateInfo = { value: exerciseType, path: "exerciseType" };
  validateRequired(validateInfo);
  validateExerciseType(validateInfo);
};
const validateWorkoutRecordDescription = (description) => {
  const validateInfo = { value: description, path: "description" };
  validateRequired(validateInfo);
};
const validateWorkoutRecordTime = (time) => {
  const validateInfo = { value: time, path: "time" };
  validateRequired(validateInfo);
};
const validateWorkoutRecordDistance = (distance) => {
  const validateInfo = { value: distance, path: "distance" };
  validateRequired(validateInfo);
  validatePositiveInteger(validateInfo);
};
const validateWorkoutRecordPhotos = (photos) => {
  const validateInfo = { value: photos, path: "photos" };
  validateArray(validateInfo);
};

//UnregisteredWorkoutRecord 검증
const validateUnregisteredWorkoutRecord = ({
  catagory,
  description,
  time,
  distance,
  images,
}) => {
  validateUnregisteredWorkoutRecordExerciseType(catagory);
  validateUnregisteredWorkoutRecordDescription(description);
  validateUnregisteredWorkoutRecordTime(time);
  validateUnregisteredWorkoutRecordDistance(distance);
  validateUnregisteredWorkoutRecordImages(images);
};
const validateUnregisteredWorkoutRecordExerciseType = (exerciseType) => {
  const validateInfo = { value: exerciseType, path: "exerciseType" };
  validateRequired(validateInfo);
  validateWhitespace(validateInfo);
  validateString(validateInfo);
  validateExerciseType(validateInfo);
};
const validateUnregisteredWorkoutRecordDescription = (description) => {
  const validateInfo = { value: description, path: "description" };
  validateRequired(validateInfo);
  validateString(validateInfo);
};
const validateUnregisteredWorkoutRecordTime = (time) => {
  const validateInfo = { value: time, path: "time" };
  validateRequired(validateInfo);
  validateTime(validateInfo);
};
const validateUnregisteredWorkoutRecordDistance = (distance) => {
  const validateInfo = { value: distance, path: "distance" };
  validateRequired(validateInfo);
  validatePositiveInteger(validateInfo);
};
const validateUnregisteredWorkoutRecordImages = (images) => {
  const validateInfo = { value: images, path: "images" };
  validateArray(validateInfo);
};

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

    return new UnregistereWorkoutRecord(info);
  }
}
