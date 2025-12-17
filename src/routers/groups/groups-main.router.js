import express from "express";
import * as groupMainController from "../../modeules/groups/groups-main.js";

const router = express.Router();
router.post("/", groupMainController.createGroup);
router.get("/", groupMainController.getGroups);
router.get("/:groupId", groupMainController.getGroup);

export default router;
