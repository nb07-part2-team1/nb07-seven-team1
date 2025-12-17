export class UnregistereGroup {
  constructor({
    name,
    description,
    image,
    goal_reps,
    discord_web_url,
    discord_server_url,
  }) {
    this.name = name;
    this.description = description;
    this.image = image;
    this.goal_reps = goal_reps;
    this.discord_web_url = discord_web_url;
    this.discord_server_url = discord_server_url;
  }

  static formInfo({
    name,
    description,
    photoUrl,
    goalRep,
    tags,
    discordWebhookUrl,
    discordInviteUrl,
  }) {
    const info = {
      name,
      description,
      tags,
      image: photoUrl,
      goal_reps: goalRep,
      discord_web_url: discordWebhookUrl,
      discord_server_url: discordInviteUrl,
    };

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

    return new Group(info);
  }
}
