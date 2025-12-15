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

    return new UnregistereGroup(info);
  }
}

export class Group {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.tags = data.tags;
    this.goalRep = data.goalRep;
    this.photoUrl = data.photoUrl;
    this.discordWebUrl = data.discordWebUrl;
    this.discordServerUrl = data.discordServerUrl;
    this.likeCount = data.likeCount;
    this.createdAt = data.createdAt;
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
  }) {
    const info = {
      id,
      name,
      description,
      tags,
      goalRep: goal_reps,
      photoUrl: image,
      discordWebUrl: discord_web_url,
      discordServerUrl: discord_server_url,
      likeCount: like_count,
      createdAt: created_at,
    };

    return new Group(info);
  }
}
