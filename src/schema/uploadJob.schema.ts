import { Schema, model, Types, Document } from "mongoose";

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
  isDeleted?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const uploadJobSchema = new Schema<IUploadJob>(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(UploadJobStatus),
      default: UploadJobStatus.PROCESSING,
    },

    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const uploadJobModel = model<IUploadJob>("UploadJob", uploadJobSchema);

export default uploadJobModel;
