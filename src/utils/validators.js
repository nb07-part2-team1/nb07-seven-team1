import {
  validateRequired,
  validateWhitespace,
  validateString,
  validatePhotoUrl,
  validatePositiveInteger,
  validateDate,
  validateLength,
  validateUrl,
} from "./validators.common.js";
import { validateNameRegex, validatePasswordRegex } from "./validators.user.js";

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
  validateRequired(nameInfo);
  validateLength({ ...nameInfo, minLength: 3, maxLength: 15 });

  //description 검증
  validateRequired(descriptionInfo);
  validateString(descriptionInfo);
  validateLength({ ...descriptionInfo, minLength: 3, maxLength: 50 });

  //photoURL 검증
  validatePhotoUrl(photoUrlInfo);

  //goalreps 검증
  validateRequired(goalRepsInfo);
  validatePositiveInteger(goalRepsInfo);

  //discordWebURL 검증
  validateRequired(discordWebhookUrlInfo);
  validateUrl(discordWebhookUrlInfo);

  //discordInviteURL 검증
  validateRequired(discordInviteUrlInfo);
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
  validateRequired(idInfo);

  //name 검증
  validateRequired(nameInfo);

  //description 검증
  validateRequired(descriptionInfo);

  //photoURL 검증
  validatePhotoUrl(photoUrlInfo);

  //goalreps 검증
  validateRequired(goalRepsInfo);

  //discordWebURL 검증
  validateRequired(discordWebhookUrlInfo);
  validateUrl(discordWebhookUrlInfo);

  //discordInviteURL 검증
  validateRequired(discordInviteUrlInfo);
  validateUrl(discordInviteUrlInfo);

  //createdAt 검증
  validateRequired(createdAtInfo);
  validateDate(createdAtInfo);

  //updatedAt 검증
  validateRequired(updatedAtInfo);
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
  validateRequired(nicknameInfo);
  validateWhitespace(nicknameInfo);
  validateLength({ ...nicknameInfo, minLength: 3, MaxLength: 10 });
  validateNameRegex(nicknameInfo);

  //password 검증
  validateRequired(passwordInfo);
  validateWhitespace(passwordInfo);
  validateLength({ ...passwordInfo, minLength: 8, maxLength: 20 });
  validatePasswordRegex(passwordInfo);

  //groupId 검증
  validateRequired(groupIdInfo);
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
  validateRequired(idInfo);
  validateInt(idInfo);

  //nickname 검증
  validateRequired(nicknameInfo);
  validateString(nicknameInfo);

  //groupId 검증
  validateRequired(groupIdInfo);
  validateInt(groupIdInfo);

  //createdAt 검증
  validateRequired(createdAtInfo);
  validateDate(createdAtInfo);

  //updatedAt 검증
  validateRequired(updatedAtInfo);
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
  validateRequired(groupIdInfo);

  //content 검증
  validateRequired(contentInfo);
  validateArray(contentInfo);
};

export const validateBadge = ({ id, content, createdAt, groupId }) => {
  //value, path로 객체 파라미터 분리
  const idInfo = { value: id, path: "id" };
  const contentInfo = { value: content, path: "content" };
  const createdAtInfo = { value: createdAt, path: "createdAt" };
  const groupIdInfo = { value: groupId, path: "groupId" };

  //id 검증
  validateRequired(idInfo);

  //content 검증
  validateRequired(contentInfo);
  validateArray(contentInfo);

  //createdAt 검증
  validateRequired(createdAtInfo);
  validateDate(createdAtInfo);

  //groupId 검증
  validateRequired(groupIdInfo);
};

/**
 * badge entity validate function
 */
