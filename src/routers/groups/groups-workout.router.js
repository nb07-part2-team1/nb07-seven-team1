import express from "express";
import GroupWorkouLogController from "../../modules/groups/groups-workout-log.controller.js";
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
  GroupWorkouLogController.create
);
//get
router.get("/:groupId/records", GroupWorkouLogController.getRecords);
//get 상세
router.get(
  "/:groupId/records/:recordId",
  GroupWorkouLogController.getRecordDetail
);

export default router;
