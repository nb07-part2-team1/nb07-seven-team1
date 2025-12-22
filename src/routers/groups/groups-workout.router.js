import express from "express";
import * as groupWorkoutController from "../../modules/groups/groups-workout.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";

const router = express.Router();

//post
router.post(
  "/:groupId/records",
  validateRequest(
    {
      exerciseType: { type: "string", required: true },
      description: { type: "string", required: true },
      time: { type: "number", required: true },
      distance: { type: "number", required: true },
      photos: { type: "array" },
      authorNickname: { type: "string", required: true },
      authorPassword: { type: "string", required: true },
    },
    "body"
  ),
  groupWorkoutController.createRecord
);
//get
router.get("/:groupId/records", groupWorkoutController.getRecords);
//get 상세
router.get(
  "/:groupId/records/:recordId",
  groupWorkoutController.getRecordDetail
);

export default router;
