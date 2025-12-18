import { uploadImageToS3 } from "../../utils/s3Uploader.js";

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new BadRequestError("No files uploaded");
    }

    const urls = await Promise.all(
      req.files.map((file) => uploadImageToS3(file))
    );

    res.status(200).json({ urls });
  } catch (err) {
    next(err);
  }
};
