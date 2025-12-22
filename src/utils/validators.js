import {
  validateWhitespace,
  validatePhotoUrl,
  validatePositiveInteger,
  validateDate,
  validateLength,
  validateWebhookUrl,
  validateSeverUrl,
  validateTime,
  validateArray,
} from "./validators.common.js";
import { validateExerciseType } from "./validators.workout.js";
import { validateNameRegex, validatePasswordRegex } from "./validators.user.js";

/**
 * group, user, badge, workout-log 검증 로직
 * 각 이름으로 검색하면
 * 해당 검증 로직 확인 가능
 */

/**
 * group entity validate function
 */
export const validateUnregisteredGroup = ({
  name,
  description,
  image,
  tags,
  goal_reps,
  discord_web_url,
  discord_server_url,
}) => {
  //name 검증
  validateLength({ value: name, path: "그룹명", minLength: 3, maxLength: 15 });

  //description 검증
  validateLength({
    value: description,
    path: "description",
    minLength: 3,
    maxLength: 50,
  });

  //photoURL 검증
  validatePhotoUrl({ value: image, path: "photoUrl" });

  //goalreps 검증
  validatePositiveInteger({ value: goal_reps, path: "goalReps" });

  //discordWebURL 검증
  validateWebhookUrl({
    value: discord_web_url,
    path: "discordWebhookUrl",
  });

  //discordInviteURL 검증
  validateSeverUrl({
    value: discord_server_url,
    path: "discordInviteUrl",
  });
};

export const validateGroup = ({
  id,
  name,
  description,
  photoUrl,
  tags,
  goalRep,
  discordWebhookUrl,
  discordInviteUrl,
  likeCount,
  createdAt,
  updatedAt,
}) => {
  //discordWebURL 검증
  validateWebhookUrl({
    value: discordWebhookUrl,
    path: "discordWebhookUrl",
  });

  //discordInviteURL 검증
  validateSeverUrl({
    value: discordInviteUrl,
    path: "discordInviteUrl",
  });

  //createdAt 검증
  validateDate({ value: createdAt, path: "createdAt" });

  //updatedAt 검증
  validateDate({ value: updatedAt, path: "updatedAt" });
};

/**
 * user entity validate function
 */
export const validateUnregisteredUser = ({ name, password, groupId }) => {
  //nickname 검증
  validateWhitespace({ value: name, path: "닉네임" });
  validateLength({ value: name, path: "닉네임", minLength: 3, MaxLength: 10 });
  validateNameRegex({ value: name, path: "닉네임" });

  //password 검증
  validateWhitespace({ value: password, path: "password" });
  validateLength({
    value: password,
    path: "password",
    minLength: 8,
    maxLength: 20,
  });
  validatePasswordRegex({ value: password, path: "password" });
};

export const validateUser = ({
  id,
  nickname,
  groupId,
  createdAt,
  updatedAt,
}) => {
  //createdAt 검증
  validateDate({ value: createdAt, path: "createdAt" });

  //updatedAt 검증
  validateDate({ value: updatedAt, path: "updatedAt" });
};

/**
 * badge entity validate function
 */
export const validateUnregisteredBadge = ({ content, group_id }) => {
  //content 검증
  validateArray({ value: content, path: "content" });
};

export const validateBadge = ({ id, content, createdAt, groupId }) => {
  //content 검증
  validateArray({ value: content, path: "content" });

  //createdAt 검증
  validateDate({ value: createdAt, path: "createdAt" });
};

/**
 * workout-log entity validate function
 */
export const validateUnregisteredWorkoutRecord = ({
  catagory,
  description,
  time,
  distance,
  images,
}) => {
  //exerciseType 검증
  validateWhitespace({ value: catagory, path: "exerciseType" });
  validateExerciseType({ value: catagory, path: "exerciseType" });

  //time 검증
  validateTime({ value: time, path: "time" });

  //distance 검증
  validatePositiveInteger({ value: distance, path: "distance" });

  //iamges 검증
  validateArray({ value: images, path: "images" });
};

export const validateWorkoutRecord = ({
  exerciseType,
  description,
  time,
  distance,
  photos,
}) => {
  //exerciseType 검증
  validateExerciseType({ value: exerciseType, path: "exerciseType" });

  //distance 검증
  validatePositiveInteger({ value: distance, path: "distance" });

  //photos 검증
  validateArray({ value: photos, path: "photos" });
};
