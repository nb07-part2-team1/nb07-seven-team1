/*
  Warnings:

  - Changed the type of `time` on the `workout_log` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
ALTER TABLE "workout_log"
ADD COLUMN "time_new" INTEGER;

UPDATE "workout_log"
SET "time_new" = EXTRACT(EPOCH FROM "time");

ALTER TABLE "workout_log"
DROP COLUMN "time";

ALTER TABLE "workout_log"
RENAME COLUMN "time_new" TO "time";

ALTER TABLE "workout_log"
ALTER COLUMN "time" SET NOT NULL;
