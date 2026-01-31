import { Request, Response } from "express";
import { getAuditLogsService } from "./service/getAuditLog.service";
import { AppError } from "../../utils/AppError";

export const getAuditLogsController = async (req: Request, res: Response) => {
  const { jobId, action, user } = req.query as {
    jobId?: string;
    action?: string;
    user?: string;
  };

  const { userId, role } = (req as any).user;

  if (!jobId) {
    throw new AppError("jobId is required", 400);
  }

  const logs = await getAuditLogsService({
    jobId,
    action,
    user,
    userId,
    role
  });

  res.status(200).json({
    success: true,
    data: logs,
  });
};
