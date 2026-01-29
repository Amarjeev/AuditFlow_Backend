import { Schema, model, Types, Document } from "mongoose";

export interface IReconciliationResult extends Document {
  uploadJobId: Types.ObjectId;
  totalRecords: number;
  totalMatchedRecords: number;
  totalUnmatchedRecords: number;
  totalPartialRecords: number;
  totalDuplicateRecords: number;
  results: {
    transactionId: string;
    excelRowNumber: number;
    status: "MATCHED" | "PARTIAL" | "DUPLICATE" | "UNMATCHED";
    matchedWith: Types.ObjectId[];
    mismatchedFields: {
      field: string;
      uploadedValue?: any;
      systemValue?: any;
      reason?: string;
    }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const reconciliationResultSchema = new Schema<IReconciliationResult>(
  {
    uploadJobId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    totalRecords: {
      type: Number,
      default: 0,
    },
    totalMatchedRecords: {
      type: Number,
      default: 0,
    },

    totalUnmatchedRecords: {
      type: Number,
      default: 0,
    },

    totalPartialRecords: {
      type: Number,
      default: 0,
    },

    totalDuplicateRecords: {
      type: Number,
      default: 0,
    },

    results: [
      {
        transactionId: {
          type: String,
          required: true,
        },

        excelRowNumber: {
          type: Number,
          required: true,
        },

        status: {
          type: String,
          enum: ["MATCHED", "PARTIAL", "DUPLICATE", "UNMATCHED"],
          required: true,
        },

        matchedWith: [
          {
            type: Schema.Types.ObjectId,
            ref: "SystemRecord",
          },
        ],

        mismatchedFields: [
          {
            field: {
              type: String,
              required: true,
            },
            uploadedValue: Schema.Types.Mixed,
            systemValue: Schema.Types.Mixed,
            reason: String,
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const reconciliationResultModel = model<IReconciliationResult>(
  "ReconciliationResult",
  reconciliationResultSchema,
);

export default reconciliationResultModel;
