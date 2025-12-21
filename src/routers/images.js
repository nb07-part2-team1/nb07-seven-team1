import express from "express";
import UploadController from "../modules/images/image.controller.js";
import { upload } from "../config/multer.config.js";

const router = express.Router();

router.post("/", upload.array("files", 10), UploadController.uploadImages);

export default router;
