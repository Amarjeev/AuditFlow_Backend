import { Types } from "mongoose";

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
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
