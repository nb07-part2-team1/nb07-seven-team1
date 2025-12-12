import express from "express";
import * as usersController from "../modeules/users/index.js";

const router = express.Router();

router.post("/:groupId/users", usersController.createUser);
router.delete("/:groupId/users", usersController.deleteUser);

export default router;
