// import "dotenv/config";
// import pkgClient from "../generated/prisma/index.js";
// import { PrismaPg } from "@prisma/adapter-pg";

// const { PrismaClient } = pkgClient;
// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error("환경 변수 DATABASE_URL을 찾을 수 없습니다.");
// }

// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({ adapter });

// export default prisma;

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
