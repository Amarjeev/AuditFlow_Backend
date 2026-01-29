import { Schema, model, Document, Types } from "mongoose";

export interface IRecord extends Document {
  uploadJobId: Types.ObjectId;
  transactionId: string;
  referenceNumber: string;
  amount: number;
  date: Date;
  source: "UPLOAD" | "SYSTEM";
  rawData?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    uploadJobId: {
      type: Schema.Types.ObjectId,
      ref: "UploadJob",
      required: true,
      index: true,
    },

    transactionId: {
      type: String,
      required: true,
      index: true,
    },

    referenceNumber: {
      type: String,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    source: {
      type: String,
      enum: ["UPLOAD", "SYSTEM"],
      required: true,
    },

    rawData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const RecordModel = model<IRecord>("Record", recordSchema);

export default RecordModel;
