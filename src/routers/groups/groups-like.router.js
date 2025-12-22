import express from "express";
import GroupLikeController from "../../modules/groups/groups-like.controller.js";

const router = express.Router();

// POST /groups/{groupId}/likes
router.post("/:groupId/likes", GroupLikeController.like);

// DELETE /groups/{groupId}/likes
router.delete("/:groupId/likes", GroupLikeController.unlike);

export default router;
