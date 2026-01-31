import uploadJobModel from "../../../schema/uploadJob.schema";
import reconciliationResultModel from "../../../schema/reconciliationResult.schema";
import { redis } from "../../../config/redis";
import { AppError } from "../../../utils/AppError";

type deleteJobsPayload = {
  userId?: string;
  role?: "admin" | "analyst" | "viewer";
  jobId: string;
};

const deleteJobsService = async ({
  userId,
  role,
  jobId,
}: deleteJobsPayload) => {
  let job = await uploadJobModel.findOne({ isDeleted: false, _id: jobId });

  if (!job) {
    throw new AppError("job not found ", 404);
  }

  if (job?.uploadedBy.toString() !== userId) {
    throw new AppError("No access to delete this file ", 404);
  }

  let result = await reconciliationResultModel.findOne({
    isDeleted: false,
    uploadJobId: jobId,
  });

  if (result && job) {
    result.isDeleted = true;
    job.isDeleted = true;
  } else {
    throw new AppError("Something went wrong deleting !", 404);
  }

  await Promise.all([job?.save(), result?.save()]);
  await redis.del("reconciliation:dashboard");

  return {
    success: true,
    message: "successfully deleted!",
  };
};

export default deleteJobsService;
