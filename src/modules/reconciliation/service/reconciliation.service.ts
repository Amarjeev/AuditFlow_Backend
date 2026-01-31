import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import { redis } from "../../../config/redis";

export const getReconciliationDashboardService = async () => {
  const cacheKey = "reconciliation:dashboard";

  const cached = await redis.get(cacheKey);
  if (cached) {
    return typeof cached === "string" ? JSON.parse(cached) : cached;
  }

  /* ------------------ AGGREGATION ------------------ */
  const aggregation = await reconciliationResultModel.aggregate([
    { $match: { isDeleted: false } },
    { $unwind: "$results" },
    {
      $group: {
        _id: "$results.status",
        count: { $sum: 1 },
      },
    },
  ]);

  let totalRecords = 0;
  let matched = 0;
  let unmatched = 0;
  let partial = 0;
  let duplicates = 0;

  for (const item of aggregation) {
    totalRecords += item.count;

    switch (item._id) {
      case "MATCHED":
        matched = item.count;
        break;
      case "UNMATCHED":
        unmatched = item.count;
        break;
      case "PARTIAL":
        partial = item.count;
        break;
      case "DUPLICATE":
        duplicates = item.count;
        break;
    }
  }

  const response = {
    totalRecords,
    matched,
    unmatched,
    partial,
    duplicates,
    accuracy:
      totalRecords === 0
        ? 0
        : Number(((matched / totalRecords) * 100).toFixed(1)),
  };

  await redis.set(cacheKey, JSON.stringify(response), { ex: 1800 });

  return response;
};
