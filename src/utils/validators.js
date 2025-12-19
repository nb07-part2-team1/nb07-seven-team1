import {
  validateWhitespace,
  validateString,
  validatePhotoUrl,
  validatePositiveInteger,
  validateDate,
  validateLength,
  validateUrl,
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
  //value, path로 객체 파라미터 분리
  const nameInfo = { value: name, path: "그룹명" };
  const descriptionInfo = { value: description, path: "description" };
  const photoUrlInfo = { value: image, path: "photoUrl" };
  const goalRepsInfo = { value: goal_reps, path: "goalReps" };
  const discordWebhookUrlInfo = {
    value: discord_web_url,
    path: "discordWebhookUrl",
  };
  const discordInviteUrlInfo = {
    value: discord_server_url,
    path: "discordInviteUrl",
  };

  //name 검증
  validateLength({ ...nameInfo, minLength: 3, maxLength: 15 });

  //description 검증
  validateString(descriptionInfo);
  validateLength({ ...descriptionInfo, minLength: 3, maxLength: 50 });

  //photoURL 검증
  validatePhotoUrl(photoUrlInfo);

  //goalreps 검증
  validatePositiveInteger(goalRepsInfo);

  //discordWebURL 검증
  validateUrl(discordWebhookUrlInfo);

  //discordInviteURL 검증
  validateUrl(discordInviteUrlInfo);
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
  //value, path로 객체 파라미터 분리
  const idInfo = { value: id, path: "id" };
  const nameInfo = { value: name, path: "그룹명" };
  const descriptionInfo = { value: description, path: "description" };
  const photoUrlInfo = { value: photoUrl, path: "photoUrl" };
  const goalRepsInfo = { value: goalRep, path: "goalReps" };
  const discordWebhookUrlInfo = {
    value: discordWebhookUrl,
    path: "discordWebhookUrl",
  };
  const discordInviteUrlInfo = {
    value: discordInviteUrl,
    path: "discordInviteUrl",
  };
  const createdAtInfo = { value: createdAt, path: "createdAt" };
  const updatedAtInfo = { value: updatedAt, path: "updatedAt" };

  //id 검증

  //name 검증

  //description 검증

  //photoURL 검증

  //goalreps 검증

  //discordWebURL 검증
  validateUrl(discordWebhookUrlInfo);

  //discordInviteURL 검증
  validateUrl(discordInviteUrlInfo);

  //createdAt 검증
  validateDate(createdAtInfo);

  //updatedAt 검증
  validateDate(updatedAtInfo);
};

/**
 * user entity validate function
 */
export const validateUnregisteredUser = ({ name, password, groupId }) => {
  //value, path로 객체 파라미터 분리
  const nicknameInfo = { value: name, path: "닉네임" };
  const passwordInfo = { value: password, path: "password" };
  const groupIdInfo = { value: groupId, path: "groupId" };

  //nickname 검증
  validateWhitespace(nicknameInfo);
  validateLength({ ...nicknameInfo, minLength: 3, MaxLength: 10 });
  validateNameRegex(nicknameInfo);

  //password 검증
  validateWhitespace(passwordInfo);
  validateLength({ ...passwordInfo, minLength: 8, maxLength: 20 });
  validatePasswordRegex(passwordInfo);

  //groupId 검증
};

export const validateUser = ({
  id,
  nickname,
  groupId,
  createdAt,
  updatedAt,
}) => {
  //value, path로 객체 파라미터 분리
  const idInfo = { value: id, path: "id" };
  const nicknameInfo = { value: nickname, path: "닉네임" };
  const groupIdInfo = { value: groupId, path: "groupId" };
  const createdAtInfo = { value: createdAt, path: "createdAt" };
  const updatedAtInfo = { value: updatedAt, path: "updatedAt" };

  //id 검증

  //nickname 검증
  validateString(nicknameInfo);

  //groupId 검증

  //createdAt 검증
  validateDate(createdAtInfo);

  //updatedAt 검증
  validateDate(updatedAtInfo);
};

/**
 * badge entity validate function
 */
export const validateUnregisteredBadge = ({ content, group_id }) => {
  //value, path로 객체 파라미터 분리
  const groupIdInfo = { value: group_id, path: "groupId" };
  const contentInfo = { value: content, path: "content" };

  //groupId 검증

  //content 검증
  validateArray(contentInfo);
};

export const validateBadge = ({ id, content, createdAt, groupId }) => {
  //value, path로 객체 파라미터 분리
  const idInfo = { value: id, path: "id" };
  const contentInfo = { value: content, path: "content" };
  const createdAtInfo = { value: createdAt, path: "createdAt" };
  const groupIdInfo = { value: groupId, path: "groupId" };

  //id 검증

  //content 검증
  validateArray(contentInfo);

  //createdAt 검증
  validateDate(createdAtInfo);

  //groupId 검증
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
  //value, path로 객체 파라미터 분리
  const exerciseTypeInfo = { value: catagory, path: "exerciseType" };
  const descriptionInfo = { value: description, path: "description" };
  const timeInfo = { value: time, path: "time" };
  const distanceInfo = { value: distance, path: "distance" };
  const imagesInfo = { value: images, path: "images" };

  //exerciseType 검증
  validateWhitespace(exerciseTypeInfo);
  validateString(exerciseTypeInfo);
  validateExerciseType(exerciseTypeInfo);

  //description 검증
  validateString(descriptionInfo);

  //time 검증
  validateTime(timeInfo);

  //distance 검증
  validatePositiveInteger(distanceInfo);

  //iamges 검증
  validateArray(imagesInfo);
};

export const validateWorkoutRecord = ({
  exerciseType,
  description,
  time,
  distance,
  photos,
}) => {
  //value, path로 객체 파라미터 분리
  const exerciseTypeInfo = { value: exerciseType, path: "exerciseType" };
  const descriptionInfo = { value: description, path: "description" };
  const timeInfo = { value: time, path: "time" };
  const distanceInfo = { value: distance, path: "distance" };
  const photosInfo = { value: photos, path: "photos" };

  //exerciseType 검증
  validateExerciseType(validateInfo);

  //description 검증

  //time 검증

  //distance 검증
  validatePositiveInteger(validateInfo);

  //photos 검증
  validateArray(validateInfo);
};
