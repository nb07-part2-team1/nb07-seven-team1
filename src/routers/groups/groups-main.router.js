import express from "express";
import GroupMainController from "../../modules/groups/groups-main.controller.js";

const router = express.Router();
router.post("/", GroupMainController.createGroup);
router.get("/", GroupMainController.getGroups);
router.get("/:groupId", GroupMainController.getGroup);
router.patch("/:groupId", GroupMainController.updateGroup);
router.delete("/:groupId", GroupMainController.deleteGroup);
export default router;
