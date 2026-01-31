import uploadJobModel from "../../../schema/uploadJob.schema";
import { Types } from "mongoose";

type GetJobsPayload = {
  userId?: string;
  role?: "admin" | "analyst" | "viewer";
};

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
