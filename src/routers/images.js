import express from "express";
import * as imageController from "../modeules/images/index.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.post("/", upload.array("files", 10), imageController.uploadImages);

export default router;
