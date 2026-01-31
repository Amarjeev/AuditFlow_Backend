import { Types } from "mongoose";

export type AuditAction =
  | "JOB_CREATED"
  | "ROW_PROCESSED"
  | "JOB_COMPLETED"
  | "JOB_COMPLETED_WITH_ERRORS";

export type AuditEntityType = "JOB" | "ROW";

export type PerformedBy = "Analyst" | "System" | "Admin";

export type AuditStatus =
  | "MATCHED"
  | "UNMATCHED"
  | "PARTIAL"
  | "DUPLICATE"
  | "SUCCESS"
  | "FAILED";

export type CreateAuditLogInput = {
  uploadJobId: Types.ObjectId;
  action: AuditAction;
  performedBy: PerformedBy;
  entityType: AuditEntityType;

  excelRowNumber?: number;
  transactionId?: string;
  status?: AuditStatus;
  details?: string;
  meta?: Record<string, any>;
};



export type GetAuditLogsParams = {
  jobId: string;
  action?: string;
  user?: string;
  userId: string;
  role: string;
};
