import { prisma } from "./prisma.js";

async function main() {
  console.log("🌱 Start seeding...");

  await prisma.$transaction(async (tx) => {
    // 1️⃣ 그룹 생성
    const group = await tx.group.create({
      data: {
        name: "새벽 러닝 크루",
        tags: ["running", "morning"],
        goal_reps: 10,
        image: null,
        discord_web_url: "https://discord.com/api/webhooks/abc",
        discord_server_url: "https://discord.gg/abc",
        like_count: 0,
      },
    });

    // 2️⃣ 그룹의 방장 유저 생성
    const user = await tx.user.create({
      data: {
        name: "owner1",
        password: "password123", // seed용 임시 값
        group_id: group.id, // 그룹 소속
      },
    });

    // 3️⃣ Owner 생성 (방장 연결)
    const owner = await tx.owner.create({
      data: {
        user_id: user.id,
        group_id: group.id,
      },
    });

    console.log("  ✅ Seed completed:");
    console.log(`     Group ID : ${group.id}`);
    console.log(`     Owner User ID : ${user.id}`);
  });

  console.log("🌱 Seeding finished.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
