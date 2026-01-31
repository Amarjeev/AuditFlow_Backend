import { Types } from "mongoose";

export enum UploadJobStatus {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface IUploadJob extends Document {
  fileName: string;
  fileHash: string;
  filePath: string;
  status: UploadJobStatus;
  uploadedBy: Types.ObjectId;
  uploadedByRole: "admin" | "analyst";
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
