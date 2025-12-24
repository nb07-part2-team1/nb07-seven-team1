import express from "express";
import GroupParticipantsController from "../../modules/groups/groups-participants.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";

const router = express.Router();

// POST /groups/{groupId}/participants
router.post(
  "/:groupId/participants",
  validateRequest({ groupId: { type: "stringInt", required: true } }, "params"),
  validateRequest(
    {
      nickname: { type: "string", require: true },
      password: { type: "string", require: true },
    },
    "body"
  ),
  GroupParticipantsController.join
);

// DELETE /groups/{groupId}/participants
router.delete(
  "/:groupId/participants",
  validateRequest({ groupId: { type: "stringInt", required: true } }, "params"),
  validateRequest(
    {
      nickname: { type: "string", require: true },
      password: { type: "string", require: true },
    },
    "body"
  ),
  GroupParticipantsController.leave
);

export default router;
