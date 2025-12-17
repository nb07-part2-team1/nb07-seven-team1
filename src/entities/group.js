import {
  validateRequired,
  validateWhitespace,
  validateString,
  validatePhotoUrl,
  validatePositiveInteger,
  validateDate,
} from "../utils/validators.common";

//UnregisteredGroup 검증
const validateUnregisteredGroupId = (id) => {
  const validateInfo = { value: id, path: "id" };
  validateRequired(validateInfo);
};
const validateUnregisteredGroupName = (name) => {
  const validateInfo = { value: name, path: "name" };
  validateRequired(validateInfo);
  validateWhitespace(validateInfo);
  validateLength({ ...validateInfo, minLength: 3, maxLength: 10 });
  validateNameRegex(validateInfo);
};
const validateUnregisteredGroupDescription = (description) => {
  const validateInfo = { value: description, path: "description" };
  validateRequired(validateInfo);
  validateString(validateInfo);
  validateLength({ ...validateInfo, minLength: 1, maxLength: 50 });
};
const validateUnregisteredGroupPhotoUrl = (photoUrl) => {
  const validateInfo = { value: photoUrl, path: "photoUrl" };
  validatePhotoUrl(validateInfo);
};
const validateUnregisteredGroupGoalRep = (goalRep) => {
  const validateInfo = { value: goalRep, path: "goalRep" };
  validateRequired(validateInfo);
  validatePositiveInteger(validateInfo);
};
const validateUnregisteredGroupDiscordWebUrl = () => {
  const validateInfo = { value: discordWebhookUrl, path: "discordWebhookUrl" };
  validateRequired(validateInfo);
  validateUrl(validateInfo);
};
const validateUnregisteredGroupDiscordServerUrl = (discordInviteUrl) => {
  const validateInfo = { value: discordInviteUrl, path: "discordInviteUrl" };
  validateRequired(validateInfo);
  validateUrl(validateInfo);
};
const validateUnregisteredGroup = ({
  id,
  name,
  description,
  image,
  goal_rep,
  discord_web_url,
  discord_server_url,
}) => {
  validateUnregisteredGroupId(id);
  validateUnregisteredGroupName(name);
  validateUnregisteredGroupDescription(description);
  validateUnregisteredGroupPhotoUrl(image);
  validateUnregisteredGroupGoalRep(goal_rep);
  validateUnregisteredGroupDiscordWebUrl(discord_web_url);
  validateUnregisteredGroupDiscordServerUrl(discord_server_url);
};

//Group 검증
const validateGroupId = (id) => {
  const validateInfo = { value: id, path: "id" };
  validateRequired(validateInfo);
};
const validateGroupName = (name) => {
  const validateInfo = { value: name, path: "name" };
  validateRequired(validateInfo);
};
const validateGroupDescription = (description) => {
  const validateInfo = { value: description, path: "description" };
  validateRequired(validateInfo);
};
const validateGroupPhotoUrl = (photoUrl) => {
  const validateInfo = { value: photoUrl, path: "photoUrl" };
  validateRequired(validateInfo);
  validatePhotoUrl(validateInfo);
};
const validateGroupTags = (tags) => {
  const validateInfo = { value: tags, path: "tags" };
};
const validateGroupGoalRep = (goalRep) => {
  const validateInfo = { value: goalRep, path: "goalRep" };
  validateRequired(validateInfo);
};
const validateGroupDiscordWebUrl = (discordWebhookUrl) => {
  const validateInfo = { value: discordWebhookUrl, path: "discordWebhookUrl" };
  validateRequired(validateInfo);
  validateUrl(validateInfo);
};
const validateGroupDiscordServerUrl = (discordInviteUrl) => {
  const validateInfo = { value: discordInviteUrl, path: "discordInviteUrl" };
  validateRequired(validateInfo);
  validateUrl(validateInfo);
};
const validateGroupLikeCount = (likeCount) => {
  const validateInfo = { value: likeCount, path: "likeCount" };
};
const validateGroupCreateAt = (createdAt) => {
  const validateInfo = { value: createdAt, path: "createdAt" };
  validateRequired(validateInfo);
  validateDate(validateInfo);
};
const validateGroupUpdateAt = (updatedAt) => {
  const validateInfo = { value: updatedAt, path: "updatedAt" };
  validateRequired(validateInfo);
  validateDate(validateInfo);
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
  validateGroupId(id);
  validateGroupName(name);
  validateGroupDescription(description);
  validateGroupPhotoUrl(photoUrl);
  validateGroupTags(tags);
  validateGroupGoalRep(goalRep);
  validateGroupDiscordWebUrl(discordWebhookUrl);
  validateGroupDiscordServerUrl(discordInviteUrl);
  validateGroupLikeCount(likeCount);
  validateGroupCreateAt(createdAt);
  validateGroupUpdateAt(updatedAt);
};

export class UnregistereGroup {
  constructor({
    id,
    name,
    description,
    image,
    goal_rep,
    discord_web_url,
    discord_server_url,
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.goal_rep = goal_rep;
    this.discord_web_url = discord_web_url;
    this.discord_server_url = discord_server_url;
  }

  static formInfo({
    name,
    description,
    photoUrl,
    goalRep,
    discordWebhookUrl,
    discordInviteUrl,
  }) {
    const info = {
      name,
      description,
      tags,
      image: photoUrl,
      goal_rep: goalRep,
      discord_web_url: discordWebhookUrl,
      discord_server_url: discordInviteUrl,
    };
    // validateUnregisteredGroup(info);

    return new UnregistereGroup(info);
  }
}

export class Group {
  constructor({
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
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.photoUrl = photoUrl;
    this.tags = tags;
    this.goalRep = goalRep;
    this.discordWebhookUrl = discordWebhookUrl;
    this.discordInviteUrl = discordInviteUrl;
    this.likeCount = likeCount;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static formEntity({
    id,
    name,
    description,
    tags,
    goal_reps,
    image,
    discord_web_url,
    discord_server_url,
    like_count,
    created_at,
    updated_at,
  }) {
    const info = {
      id: parseInt(id),
      name,
      description,
      tags,
      goalRep: goal_reps,
      photoUrl: image,
      discordWebhookUrl: discord_web_url,
      discordInviteUrl: discord_server_url,
      likeCount: like_count,
      createdAt: created_at,
      updatedAt: updated_at,
    };
    // validateGroup(info);

    return new Group(info);
  }
}
