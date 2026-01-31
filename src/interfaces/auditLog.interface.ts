import { Types } from "mongoose";

export type AuditAction =
  | "JOB_CREATED"
  | "ROW_PROCESSED"
  | "JOB_COMPLETED"
  | "JOB_COMPLETED_WITH_ERRORS";

export type AuditEntityType = "JOB" | "ROW";

export type PerformedBy = "Analyst" | "System" | "Admin";

export interface AuditLog {
  uploadJobId: Types.ObjectId;
  action: AuditAction;
  performedBy: PerformedBy;
  entityType: AuditEntityType;

  rowId?: Types.ObjectId | null;
  excelRowNumber?: number | null;
  transactionId?: string | null;
  status?: string | null;
  details?: string | null;
  meta?: Record<string, any>;
  createdAt: Date;
}
