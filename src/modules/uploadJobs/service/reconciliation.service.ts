import { Types } from "mongoose";
import uploadJobModel from "../../../schema/uploadJob.schema";
import { systemRecordModel } from "../../../schema/systemRecord.schema";
import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import { AppError } from "../../../utils/AppError";
import { parseExcel } from "../../../utils/excelParser";

export type ReconciliationJobPayload = {
  uploadJobId: Types.ObjectId;
  mapping?: Record<string, string> | null;
};

const reconciliationJobsService = async ({
  uploadJobId,
  mapping,
}: ReconciliationJobPayload) => {
  // STEP 1: Get upload job
  const uploadJob = await uploadJobModel.findOne({
    _id: uploadJobId,
    isDeleted: false,
  });

  if (!uploadJob) {
    throw new AppError("Upload job not found", 404);
  }

  // Prevent re-processing
  if (uploadJob.status !== "PROCESSING") {
    return;
  }

  // STEP 2: Load system records
  const systemRecords = await systemRecordModel.find().lean();

  // STEP 3: Parse uploaded Excel
  const rows = parseExcel(uploadJob.filePath) as Record<string, any>[];

  const results: any[] = [];

  let totalRecords = 0;
  let totalMatchedRecords = 0;
  let totalUnmatchedRecords = 0;
  let totalPartialRecords = 0;
  let totalDuplicateRecords = 0;

  // STEP 4: Compare row by row
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const excelRowNumber = i + 2; // header = row 1

    const transactionId = mapping?.transactionId
      ? row[mapping.transactionId]
      : row.transactionId;

    const amount = Number(
      mapping?.amount ? row[mapping.amount] : row.amount
    );

    const matchedSystemRecords = systemRecords.filter(
      (r) => r.transactionId === transactionId
    );

    let status: "MATCHED" | "PARTIAL" | "DUPLICATE" | "UNMATCHED" = "UNMATCHED";
    let matchedWith: Types.ObjectId[] = [];
    let mismatchedFields: any[] = [];

    // NO MATCH
    if (matchedSystemRecords.length === 0) {
      status = "UNMATCHED";
    }

    // SINGLE MATCH
    if (matchedSystemRecords.length === 1) {
      const systemRecord = matchedSystemRecords[0];
      matchedWith.push(systemRecord._id);

      if (systemRecord.amount === amount) {
        status = "MATCHED";
      } else {
        status = "PARTIAL";
        mismatchedFields.push({
          field: "amount",
          uploadedValue: amount,
          systemValue: systemRecord.amount,
          reason: "Amount mismatch",
        });
      }
    }

    // DUPLICATE MATCH
    if (matchedSystemRecords.length > 1) {
      status = "DUPLICATE";
      matchedWith = matchedSystemRecords.map((r) => r._id);
    }

    // ✅ increment counters based on final status
    switch (status) {
      case "MATCHED":
        totalMatchedRecords++;
        break;
      case "UNMATCHED":
        totalUnmatchedRecords++;
        break;
      case "PARTIAL":
        totalPartialRecords++;
        break;
      case "DUPLICATE":
        totalDuplicateRecords++;
        break;
    }

    results.push({
      transactionId,
      excelRowNumber,
      status,
      matchedWith,
      mismatchedFields,
    });

    totalRecords++;
  }

  // STEP 5: Save ONE reconciliation document per job
  await reconciliationResultModel.create({
    uploadJobId: uploadJob._id,
    totalRecords,
    totalMatchedRecords,
    totalUnmatchedRecords,
    totalPartialRecords,
    totalDuplicateRecords,
    results,
  });

  // STEP 6: Update upload job
  await uploadJobModel.findByIdAndUpdate(uploadJob._id, {
    status: "COMPLETED",
    totalRecords,
  });
};

export default reconciliationJobsService;
