import { Schema, model } from "mongoose";
import { IUploadJob ,UploadJobStatus} from "../interfaces/uploadJob.interface";

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
      required: true,
    },

    uploadedByRole: {
      type: String,
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
