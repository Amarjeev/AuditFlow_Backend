import { AppError } from "../../../utils/AppError";
import { validateJobUpload } from "../jobs.validation";
import uploadJobModel from "../../../schema/uploadJob.schema";
import reconciliationJobsService from "./reconciliation.service";
import { redis } from "../../../config/redis";
import { JobsServicePayload } from "../type/uploadJobs.type";

const jobsService = async ({
  file,
  mapping,
  fileHash,
  userId,
  role,
}: JobsServicePayload) => {
  const fileExist = await uploadJobModel
    .findOne({
      isDeleted: false,
      fileHash,
    })
    .lean()
    .select("fileHash");

  if (fileExist) {
    throw new AppError(
      "This file has already been uploaded. Please upload a different file.",
      409,
    );
  }

  validateJobUpload({ file, mapping });

  let parsedMapping = null;
  if (mapping) {
    parsedMapping = JSON.parse(mapping);
  }

  const uploadJob = await uploadJobModel.create({
    fileName: file.originalname,
    fileHash,
    filePath: file?.path,
    uploadedBy: userId,
    uploadedByRole: role,
  });

  if (!uploadJob?._id) {
    throw new AppError("Failed to create upload job", 500);
  }

  reconciliationJobsService({
    uploadJobId: uploadJob?._id,
    mapping: parsedMapping,
  });

  await redis.del("reconciliation:dashboard");

  return {
    success: true,
    message: "Job uploaded successfully",
    job: {
      _id: uploadJob?._id,
      createdAt: uploadJob?.createdAt,
      fileName: uploadJob?.fileName,
      status: uploadJob?.status,
    },
  };
};

export default jobsService;
