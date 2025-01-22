import multer from "multer";
import multerS3 from "multer-s3";
import { s3 } from "../config/aws.config";
import { Request } from "express";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export interface MulterS3File extends Express.Multer.File {
  location: string;
  key: string;
  bucket: string;
  acl: string;
  contentType: string;
  contentDisposition: string | null;
  storageClass: string;
  serverSideEncryption: string | null;
  metadata: any;
  etag: string;
}

const uploadFileToS3 = (folderName?: string) => {
  return multer({
    storage: multerS3({
      s3: s3,
      bucket: process.env.AWS_S3_BUCKET_NAME!,
      acl: "public-read",
      metadata: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: any, metadata?: any) => void
      ) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (
        req: Request,
        file: Express.Multer.File,
        cb: (error: any, key?: string) => void
      ) {
        const uniqueSuffix = Date.now().toString() + "-" + file.originalname;
        const fullKey = folderName ? `${folderName}/${uniqueSuffix}` : uniqueSuffix;
        cb(null, fullKey);
      },
    }),
  });
};

const deleteFileFromS3 = async (key: string): Promise<void> => {
  const bucketParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  };
  try {
    await s3.send(new DeleteObjectCommand(bucketParams));
    console.log(`File ${key} deleted successfully`);
  } catch (err) {
    console.error(`Error deleting file ${key}:`, err);
    throw err;
  }
};

export { uploadFileToS3, deleteFileFromS3 };
