import express from "express";
import * as groupLikeController from "../../modules/groups/groups-like.js";

const router = express.Router();

// POST /groups/{groupId}/likes
router.post("/:groupId/likes", groupLikeController.likeGroup);

// DELETE /groups/{groupId}/likes
router.delete("/:groupId/likes", groupLikeController.unLikeGroup);

export default router;
