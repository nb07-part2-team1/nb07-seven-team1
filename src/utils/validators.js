import {
  validateRequired,
  validateWhitespace,
  validateString,
  validatePhotoUrl,
  validatePositiveInteger,
  validateDate,
  validateLength,
  validateUrl,
} from "../utils/validators.common.js";
import { validateNameRegex } from "./validators.user.js";

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

const validateGroup = ({
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
 *
 */
