import express from "express";
import * as groupLankController from "../../modules/groups/groups-rank.js";

const router = express.Router();

router.get("/:groupId/rank", groupLankController.getRank);

export default router;
