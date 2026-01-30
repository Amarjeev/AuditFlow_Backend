import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import { redis } from "../../../config/redis";

export const getReconciliationDashboardService = async () => {
  const cacheKey = "reconciliation:dashboard";

  /* ------------------ SAFE REDIS GET ------------------ */
    const cachedData = await redis.get(cacheKey);
    if (cachedData) return cachedData;

  /* ------------------ CORRECT AGGREGATION ------------------ */
  const result = await reconciliationResultModel.aggregate([
    {
      $match: {
        isDeleted: false,
      },
    },
    {
      $unwind: "$results",
    },
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
  let duplicates = 0;

  for (const item of result) {
    totalRecords += item.count;

    if (item._id === "MATCHED") matched = item.count;
    if (item._id === "UNMATCHED") unmatched = item.count;
    if (item._id === "DUPLICATE") duplicates = item.count;
  }

  const response = {
    totalRecords,
    matched,
    unmatched,
    duplicates,
    accuracy:
      totalRecords === 0
        ? 0
        : Number(((matched / totalRecords) * 100).toFixed(1)),
  };

  /* ------------------ SAFE REDIS SET ------------------ */
  if (redis) {
    redis.set(cacheKey, response, { ex: 1800 });
  }

  return response;
};
