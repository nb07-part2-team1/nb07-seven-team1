import express from "express";
import * as groupWorkoutController from "../../modeules/groups/groups-workout.js";

const router = express.Router();

//post
router.post("/records", groupWorkoutController.createRecord);
//get
router.get("/:groupId/records", groupWorkoutController.getRecords);
//get 상세
router.get("/records/:recordId", groupWorkoutController.getRecordDetail);
//patch
router.patch("/records/:recordId", groupWorkoutController.updateRecord);
//delete
router.delete("/records/:recordId", groupWorkoutController.deleteRecord);

export default router;
