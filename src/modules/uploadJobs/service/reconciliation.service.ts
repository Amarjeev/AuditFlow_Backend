import fs from "fs";
import uploadJobModel from "../../../schema/uploadJob.schema";
import { systemRecordModel } from "../../../schema/systemRecord.schema";
import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import { AppError } from "../../../utils/AppError";
import { parseExcel } from "../../../utils/excelParser";
import { createAuditLog } from "../../audit/service/createAuditLog.service";
import { ReconciliationJobPayload } from "../type/uploadJobs.type";
import { Types } from "mongoose";

const reconciliationJobsService = async ({
  uploadJobId,
  mapping,
}: ReconciliationJobPayload) => {
  let totalRecords = 0;

  try {
    const uploadJob = await uploadJobModel.findOne({
      _id: uploadJobId,
      isDeleted: false,
    });

    if (!uploadJob) {
      throw new AppError("Upload job not found", 404);
    }

    if (uploadJob.status !== "PROCESSING") {
      return;
    }

    await createAuditLog({
      uploadJobId,
      action: "JOB_CREATED",
      performedBy: "Analyst",
      entityType: "JOB",
      details: `${uploadJob.fileName} uploaded`,
    });

    const systemRecords = await systemRecordModel.find().lean();

    const rows = parseExcel(uploadJob.filePath) as Record<string, any>[];

    const results: any[] = [];

    let totalMatchedRecords = 0;
    let totalUnmatchedRecords = 0;
    let totalPartialRecords = 0;
    let totalDuplicateRecords = 0;

    // Compare row by row
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const excelRowNumber = i + 2;

      const transactionId = mapping?.transactionId
        ? row[mapping.transactionId]
        : row.transactionId;

      const amount = Number(mapping?.amount ? row[mapping.amount] : row.amount);

      const matchedSystemRecords = systemRecords.filter(
        (r) => r.transactionId === transactionId,
      );

      let status: "MATCHED" | "PARTIAL" | "DUPLICATE" | "UNMATCHED" =
        "UNMATCHED";
      let matchedWith: Types.ObjectId[] = [];
      let mismatchedFields: any[] = [];

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
      } else if (matchedSystemRecords.length > 1) {
        status = "DUPLICATE";
        matchedWith = matchedSystemRecords.map((r) => r._id);
      }

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

      await createAuditLog({
        uploadJobId,
        action: "ROW_PROCESSED",
        performedBy: "System",
        entityType: "ROW",
        excelRowNumber,
        transactionId,
        status,
        details:
          status === "MATCHED"
            ? "Row matched successfully"
            : status === "UNMATCHED"
              ? "No matching system record found"
              : status === "PARTIAL"
                ? "Amount mismatch"
                : "Duplicate transaction detected",
      });

      results.push({
        transactionId,
        excelRowNumber,
        status,
        matchedWith,
        mismatchedFields,
      });

      totalRecords++;
    }

    await reconciliationResultModel.create({
      uploadJobId,
      totalRecords,
      totalMatchedRecords,
      totalUnmatchedRecords,
      totalPartialRecords,
      totalDuplicateRecords,
      results,
    });

    const finalAction =
      totalUnmatchedRecords > 0 ||
      totalPartialRecords > 0 ||
      totalDuplicateRecords > 0
        ? "JOB_COMPLETED_WITH_ERRORS"
        : "JOB_COMPLETED";

    await createAuditLog({
      uploadJobId,
      action: finalAction,
      performedBy: "System",
      entityType: "JOB",
      details: `Matched: ${totalMatchedRecords}, Unmatched: ${totalUnmatchedRecords}, Partial: ${totalPartialRecords}, Duplicate: ${totalDuplicateRecords}`,
    });

    await uploadJobModel.findByIdAndUpdate(uploadJobId, {
      status: "COMPLETED",
      totalRecords,
    });

    if (uploadJob?.filePath) {
      fs.unlink(uploadJob?.filePath, (err) => {
        if (err) {
          console.error("Failed to delete uploaded file:", err);
        }
      });
    }
  } catch (error: any) {
    await uploadJobModel.findByIdAndUpdate(uploadJobId, {
      status: "FAILED",
      totalRecords,
    });

    await createAuditLog({
      uploadJobId,
      action: "JOB_COMPLETED_WITH_ERRORS",
      performedBy: "System",
      entityType: "JOB",
      details: "Job failed due to internal error",
    });

    return;
  }
};

export default reconciliationJobsService;
