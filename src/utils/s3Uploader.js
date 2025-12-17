import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3, S3_BUCKET } from "../config/s3.config.js";
import { randomUUID } from "crypto";

export const uploadImageToS3 = async ({ buffer, mimetype }) => {
  const ext = mimetype.split("/")[1];
  const key = `part2/images/${randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  return `https://${S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};
