import express from "express";
import groupMainRouter from "./groups/groups-main.router.js";
import groupRankRouter from "./groups/groups-rank.router.js";
import groupParticipantsRouter from "./groups/groups-participants.router.js";
import groupLikeRouter from "./groups/groups-like.router.js";
import groupWorkoutRouter from "./groups/groups-workout.router.js";
import usersRouter from "./users.js";

const router = express.Router();

router.use("/groups", groupMainRouter);
router.use("/groups", groupRankRouter);
router.use("/groups", groupParticipantsRouter);
router.use("/groups", groupLikeRouter);
router.use("/groups", groupWorkoutRouter);

router.use("/groups", usersRouter);

export default router;
