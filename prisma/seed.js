import { prisma } from "./prisma.js";
// 28
// 유저 id: 80 name: 신영석
async function main() {
  const data = new Array(99).fill().map((v) => {
    return {
      category: "run",
      description: "테스트",
      time: 3,
      distance: 1,
      images: [],
      user_id: 80,
    };
  });

  console.log(data);

  await prisma.workoutLog.createMany({
    data,
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
