import { Schema, model, Types } from "mongoose";

const AuditLogSchema = new Schema(
  {
    uploadJobId: {
      type: Types.ObjectId,
      ref: "UploadJob",
      required: true,
      index: true,
    },

    // What happened
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

    // Who did it
    performedBy: {
      type: String, // "Analyst" | "System" | "Admin"
      required: true,
    },

    // On what
    entityType: {
      type: String, // "JOB" | "ROW"
      required: true,
    },

    // Row-level fields (only for ROW events)
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

    // Result of action
    status: {
      type: String, // "SUCCESS" | "FAILED" | "UNMATCHED" | "MATCHED"
      default: null,
    },

    // Extra info / error reason
    details: {
      type: String,
      default: null,
    },

    // Optional structured metadata
    meta: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // IMMUTABLE
  }
);

export const AuditLogModel = model("AuditLog", AuditLogSchema);
