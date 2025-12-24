import express from "express";
import GroupLankController from "../../modules/groups/groups-rank.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";

const router = express.Router();

router.get(
  "/:groupId/rank",
  validateRequest({ groupId: { type: "stringInt", required: true } }, "params"),
  GroupLankController.getWorkoutRank
);

export default router;
