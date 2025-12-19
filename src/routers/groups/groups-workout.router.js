import express from "express";
import * as groupWorkoutController from "../../modules/groups/groups-workout.js";

const router = express.Router();

//post
router.post("/:groupId/records", groupWorkoutController.createRecord);
//get
router.get("/:groupId/records", groupWorkoutController.getRecords);
//get 상세
router.get(
  "/:groupId/records/:recordId",
  groupWorkoutController.getRecordDetail
);

export default router;
