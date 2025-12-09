import express from "express";
import * as usersController from "../modeules/users/index.js";

const router = express.Router();

router.post("/:groupId/users", usersController.createUser);

export default router;
