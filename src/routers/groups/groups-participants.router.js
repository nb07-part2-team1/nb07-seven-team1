import express from "express";
import * as groupParticipantsController from "../../modeules/groups/groups-participants.js";

const router = express.Router();

// POST /groups/{groupId}/participants
router.post("/:groupId/participants", groupParticipantsController.joinGroup);

// DELETE /groups/{groupId}/participants
router.delete("/:groupId/participants", groupParticipantsController.leaveGroup);

export default router;
