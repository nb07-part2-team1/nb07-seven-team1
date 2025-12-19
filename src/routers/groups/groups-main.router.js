import express from "express";
import * as groupMainController from "../../modules/groups/groups-main.js";

const router = express.Router();
router.post("/", groupMainController.createGroup);
router.get("/", groupMainController.getGroups);
router.get("/:groupId", groupMainController.getGroup);
router.patch("/:groupId", groupMainController.patchGroup);
router.delete("/:groupId", groupMainController.deleteGroup);
export default router;
