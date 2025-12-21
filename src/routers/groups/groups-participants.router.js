import express from "express";
import GroupParticipantsController from "../../modules/groups/groups-participants.controller.js";

const router = express.Router();

// POST /groups/{groupId}/participants
router.post("/:groupId/participants", GroupParticipantsController.join);

// DELETE /groups/{groupId}/participants
router.delete("/:groupId/participants", GroupParticipantsController.leave);

export default router;
