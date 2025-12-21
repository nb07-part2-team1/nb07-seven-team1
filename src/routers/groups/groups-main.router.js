import express from "express";
import GroupMainController from "../../modules/groups/groups-main.controller.js";
import { validateRequest } from "../../middlewares/validateRequest.middleware.js";

const router = express.Router();
router.post(
  "/",
  validateRequest(
    {
      name: { type: "string", required: true },
      description: { type: "string", required: true },
      photoUrl: { type: "string" },
      goalRep: { type: "number", required: true },
      discordWebhookUrl: { type: "string", required: true },
      discordInviteUrl: { type: "string", required: true },
      tags: { type: "array" },
      ownerNickname: { type: "string", required: true },
      ownerPassword: { type: "string", required: true },
    },
    "body"
  ),
  GroupMainController.createGroup
);
router.get("/", GroupMainController.getGroups);
router.get("/:groupId", GroupMainController.getGroup);
router.patch(
  "/:groupId",
  validateRequest(
    {
      name: { type: "string", required: true },
      description: { type: "string", required: true },
      photoUrl: { type: "string" },
      goalRep: { type: "number", required: true },
      discordWebhookUrl: { type: "string", required: true },
      discordInviteUrl: { type: "string", required: true },
      tags: { type: "array" },
      ownerNickname: { type: "string", required: true },
      ownerPassword: { type: "string", required: true },
    },
    "body"
  ),
  GroupMainController.updateGroup
);
router.delete("/:groupId", GroupMainController.deleteGroup);
export default router;
