import { Types } from "mongoose";
import { AuditLogModel } from "../../../schema/auditLog.schema";
import { AppError } from "../../../utils/AppError";
import uploadJobModel from "../../../schema/uploadJob.schema";
import { GetAuditLogsParams } from "../type/auditLog.types";

export const getAuditLogsService = async ({
  jobId,
  action,
  user,
  userId,
  role,
}: GetAuditLogsParams) => {
  const job = await uploadJobModel.findById(jobId).lean();

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  // Admin can view all
  if (role !== "admin") {
    if (job?.uploadedBy.toString() !== userId) {
      throw new AppError("You are not allowed to view this audit log", 403);
    }
  }

  const filter: any = {
    uploadJobId: new Types.ObjectId(jobId),
  };

  if (action && action !== "ALL") {
    filter.action = action;
  }

  if (user) {
    filter.performedBy = { $regex: user, $options: "i" };
  }

  const logs = await AuditLogModel.find(filter).sort({ createdAt: -1 }).lean();

  return logs.map((log) => ({
    id: log._id,
    timestamp: log.createdAt,
    action: log.action,
    performedBy: log.performedBy,
    entity: log.entityType,
    entityId: log.uploadJobId,
    rowNo: log.excelRowNumber,
    status: log.status,
    details: log.details,
    meta: log.meta,
  }));
};
