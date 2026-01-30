import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import uploadJobModel from "../../../schema/uploadJob.schema";
import { Types } from "mongoose";

type QueryParams = {
  status?: string;
  uploadedBy?: string;
  fromDate?: string;
  toDate?: string;
};

const STATUS_FIELD_MAP: Record<string, string> = {
  matched: "totalMatchedRecords",
  unmatched: "totalUnmatchedRecords",
  partial: "totalPartialRecords",
  duplicates: "totalDuplicateRecords",
};

export const getReconciliationChartDataService = async (query: QueryParams) => {
  /* ---------------- JOB FILTER ---------------- */
  const jobMatch: any = { isDeleted: false };

  if (query.fromDate || query.toDate) {
    jobMatch.createdAt = {};
    if (query.fromDate) jobMatch.createdAt.$gte = new Date(query.fromDate);
    if (query.toDate) jobMatch.createdAt.$lte = new Date(query.toDate);
  }

  if (query.uploadedBy && Types.ObjectId.isValid(query.uploadedBy)) {
    jobMatch.uploadedBy = new Types.ObjectId(query.uploadedBy);
  }

  const uploadJobIds = (
    await uploadJobModel.find(jobMatch).select("_id").lean()
  ).map((j) => j._id);

  if (!uploadJobIds.length) {
    return { matched: 0, unmatched: 0, partial: 0, duplicate: 0, accuracy: 0 };
  }

  /* ---------------- RECONCILIATION ---------------- */
  let aggregation;

  if (!query.status || query.status === "all") {
    aggregation = await reconciliationResultModel.aggregate([
      {
        $match: {
          isDeleted: false,
          uploadJobId: { $in: uploadJobIds },
        },
      },
      {
        $group: {
          _id: null,
          matched: { $sum: "$totalMatchedRecords" },
          unmatched: { $sum: "$totalUnmatchedRecords" },
          partial: { $sum: "$totalPartialRecords" },
          duplicate: { $sum: "$totalDuplicateRecords" },
        },
      },
    ]);
  } else {
    const status = query.status.toUpperCase();

    aggregation = await reconciliationResultModel.aggregate([
      {
        $match: {
          isDeleted: false,
          uploadJobId: { $in: uploadJobIds },
        },
      },
      { $unwind: "$results" },
      { $match: { "results.status": status } },
      {
        $group: {
          _id: null,
          matched: {
            $sum: { $cond: [{ $eq: ["$results.status", "MATCHED"] }, 1, 0] },
          },
          unmatched: {
            $sum: { $cond: [{ $eq: ["$results.status", "UNMATCHED"] }, 1, 0] },
          },
          partial: {
            $sum: { $cond: [{ $eq: ["$results.status", "PARTIAL"] }, 1, 0] },
          },
          duplicate: {
            $sum: { $cond: [{ $eq: ["$results.status", "DUPLICATE"] }, 1, 0] },
          },
        },
      },
    ]);
  }

  /* ---------------- RESPONSE ---------------- */
  const result = aggregation[0] ?? {
    matched: 0,
    unmatched: 0,
    partial: 0,
    duplicate: 0,
  };

  const total =
    result.matched + result.unmatched + result.partial + result.duplicate;

  return {
    ...result,
    accuracy: total === 0 ? 0 : Math.round((result.matched / total) * 100),
  };
};
