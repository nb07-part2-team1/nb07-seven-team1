import { uploadImageToS3 } from "../../utils/s3Uploader.js";
import BaseController from "../base.controller.js";
import { BadRequestError } from "../../errors/customError.js";

class UploadController {
  uploadImages = BaseController.handle(async (req, res) => {
    if (!req.files || req.files.length === 0) {
      throw new BadRequestError("No files uploaded");
    }

    const urls = await Promise.all(
      req.files.map((file) => uploadImageToS3(file))
    );

    res.status(200).json({ urls });
  });
}

export default new UploadController();
