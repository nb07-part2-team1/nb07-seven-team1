import express from "express";
import GroupWorkouLogController from "../../modules/groups/groups-workout-log.controller.js";

const router = express.Router();

//post
router.post("/:groupId/records", GroupWorkouLogController.create);
//get
router.get("/:groupId/records", GroupWorkouLogController.getRecords);
//get 상세
router.get(
  "/:groupId/records/:recordId",
  GroupWorkouLogController.getRecordDetail
);

export default router;
