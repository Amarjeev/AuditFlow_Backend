import { Schema, model, Document } from "mongoose";

export interface ISystemRecord {
  transactionId: string;
  referenceNumber: string;
  amount: number;
  date: Date;
  source: "SYSTEM";
  createdAt: Date;
}

const SystemRecordSchema = new Schema<ISystemRecord>(
  {
    transactionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    referenceNumber: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    source: {
      type: String,
      enum: ["SYSTEM"],
      default: "SYSTEM",
      immutable: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const systemRecordModel = model<ISystemRecord>(
  "systemRecord",
  SystemRecordSchema,
);
