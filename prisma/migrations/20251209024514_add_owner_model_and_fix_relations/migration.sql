/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Group` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_owner_id_fkey";

-- DropIndex
DROP INDEX "Group_owner_id_key";

-- AlterTable
ALTER TABLE "Group" DROP COLUMN "owner_id";

-- CreateTable
CREATE TABLE "Owner" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_user_id_key" ON "Owner"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Owner_group_id_key" ON "Owner"("group_id");

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Owner" ADD CONSTRAINT "Owner_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
