import express from "express";
import GroupLikeController from "../../modules/groups/groups-like.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";

const router = express.Router();

// POST /groups/{groupId}/likes
router.post(
  "/:groupId/likes",
  validateRequest({ groupId: { type: "stringInt", required: true } }, "params"),
  GroupLikeController.like
);

// DELETE /groups/{groupId}/likes
router.delete(
  "/:groupId/likes",
  validateRequest({ groupId: { type: "stringInt", required: true } }, "params"),
  GroupLikeController.unlike
);

export default router;
