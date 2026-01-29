import { Types } from "mongoose";
import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import uploadJobModel from "../../../schema/uploadJob.schema";
import { AppError } from "../../../utils/AppError";

const getReconciliationJobDataService = async (jobId: string) => {
  if (!Types.ObjectId.isValid(jobId)) {
    throw new AppError("Invalid job id", 400);
  }

  const fileExist = await uploadJobModel.findOne({
    isDeleted: false,
    _id: jobId,
  });

  if (!fileExist) {
    throw new AppError("Upload job not found.", 404);
  }

  const result = await reconciliationResultModel
    .findOne({
      uploadJobId: new Types.ObjectId(jobId),
      isDeleted: false,
    })
    .lean();

  if (!result) {
    throw new AppError("Reconciliation job not found", 404);
  }

  return result;
};

export default getReconciliationJobDataService;
