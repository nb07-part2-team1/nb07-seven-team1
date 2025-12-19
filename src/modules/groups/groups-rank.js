import { prisma } from "../../../prisma/prisma.js";

const getStartDateByType = (type) => {
  const now = new Date();

  if (type === "weekly") {
    const day = now.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - diff);
    monday.setHours(0, 0, 0, 0);

    return monday;
  }

  return new Date(now.getFullYear(), now.getMonth(), 1);
};

export const getRank = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const duration = req.query.duration;
    const startDate = getStartDateByType(duration);

    const queryResut = await prisma.$queryRaw`
        SELECT
            u.id AS "participantId",
            u.name AS "nickname",
            CAST(COALESCE(SUM(w.time), 0) AS INT) AS "recordTime",
            CAST(COUNT(w.id) AS INT) AS "recordCount"
        FROM "User" u
        LEFT JOIN "workout_log" w
            ON u.id = w.user_id
            AND w.created_at >= ${startDate}
        WHERE u.group_id = ${BigInt(groupId)}
        GROUP BY u.id
        ORDER BY
            "recordTime" DESC,
            "recordCount" ASC,
            u.id ASC
    `;

    const result = queryResut.map((info) => {
      return { ...info, participantId: Number(info.participantId) };
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
