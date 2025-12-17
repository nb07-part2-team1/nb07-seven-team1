import multer from "multer";
import path from "path";
import { BadRequestError } from "../errors/customError.js";

const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (!file.mimetype.startsWith("image/") || !allowedExt.includes(ext)) {
    return cb(new BadRequestError("File should be an image file"));
  }

  cb(null, true);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
