export class UnregistereGroup {
  constructor(
    id,
    name,
    description,
    photoUrl,
    goalRep,
    discordWebhookUrl,
    discordInviteUrl
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.photoUrl = photoUrl;
    this.goalRep = goalRep;
    this.discordWebhookUrl = discordWebhookUrl;
    this.discordInviteUrl = discordInviteUrl;
  }

  static formInfo(name, description, photoUrl, goalRep, discordWebhookUrl) {
    const info = {
      name,
      description,
      tags,
      image: photoUrl,
      goal_rep: goalRep,
      discord_web_url: discordWebhookUrl,
      discord_server_url: discordInviteUrl,
    };

    return new UnregistereGroup(info.name, info.description, info.image);
  }
}

export class Group {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.goalReps = data.goal_reps;
    this.disc = data.image;
    this.discord_web_url = data.discord_web_url;
    this.discord_server_url = data.discord_server_url;
    this.like_count = data.like_count;
    this.created_at = data.created_at;
  }

  static formEntity(
    id,
    name,
    description,
    tags,
    goalRep,
    image,
    discordWebUrl,
    discordServerUrl,
    likeCount,
    created_at
  ) {
    const info = {
      id,
      name,
      description,
      tags,
      goal_rep: goalRep,
      photoUrl: image,
      discord_web_url: discordWebUrl,
      discord_server_url: discordServerUrl,
      like_count: likeCount,
      createdAt: created_at,
    };

    return new Group(info);
  }
}
