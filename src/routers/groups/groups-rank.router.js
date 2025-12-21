import express from "express";
import GroupLankController from "../../modules/groups/groups-rank.controller.js";

const router = express.Router();

router.get("/:groupId/rank", GroupLankController.getWorkoutRank);

export default router;
