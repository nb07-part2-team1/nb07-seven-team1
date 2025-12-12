import express from "express";
import {
  createGroup,
  getGroup,
  getGroupDetail,
  patchGroup,
  deleteGroup,
} from "../groups/groups-main.js";

const router = express.Router();

router.post("/", createGroup);
router.get("/", getGroup);
router.get("/:groupId", getGroupDetail);
router.patch("/:groupId", patchGroup);
router.delete("/:groupId", deleteGroup);

export default router;
