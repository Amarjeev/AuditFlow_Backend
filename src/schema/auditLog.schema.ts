import { Schema, model, Types } from "mongoose";

const AuditLogSchema = new Schema(
  {
    uploadJobId: {
      type: Types.ObjectId,
      ref: "UploadJob",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: [
        "JOB_CREATED",
        "ROW_PROCESSED",
        "JOB_COMPLETED",
        "JOB_COMPLETED_WITH_ERRORS",
      ],
      required: true,
    },

    performedBy: {
      type: String,
      required: true,
    },

    entityType: {
      type: String,
      required: true,
    },

    rowId: {
      type: Types.ObjectId,
      ref: "ReconciliationResult",
      default: null,
    },

    excelRowNumber: {
      type: Number,
      default: null,
    },

    transactionId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      default: null,
    },

    details: {
      type: String,
      default: null,
    },

    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const AuditLogModel = model("AuditLog", AuditLogSchema);
