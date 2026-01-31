import uploadJobModel from "../../../schema/uploadJob.schema";
import { Types } from "mongoose";
import { GetJobsPayload } from "../type/uploadJobs.type";

const getJobsService = async ({ userId, role }: GetJobsPayload) => {
  const query: any = { isDeleted: false };

  if (role !== "admin") {
    query.uploadedBy = new Types.ObjectId(userId);
  }

  const jobs = await uploadJobModel
    .find(query)
    .sort({ createdAt: -1 })
    .lean()
    .select("status createdAt fileName uploadedByRole");

  return jobs;
};

export default getJobsService;
