import express from "express";
import * as usersController from "../modeules/users/index.js";

const router = express.Router();

router.post("/:groupId/participants", usersController.createUser);
router.delete("/:groupId/participants", usersController.deleteUser);

export default router;
