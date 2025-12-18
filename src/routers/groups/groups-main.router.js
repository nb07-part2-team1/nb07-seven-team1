import express from "express";
import * as groupMainController from "../../modules/groups/groups-main.js";

const router = express.Router();
router.post("/", groupMainController.createGroup);
router.get("/", groupMainController.getGroups);
router.get("/:groupId", groupMainController.getGroup);

export default router;
