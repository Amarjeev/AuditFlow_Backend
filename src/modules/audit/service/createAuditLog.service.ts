import { Types } from "mongoose";
import { AuditLogModel } from "../../../schema/auditLog.schema";

export type AuditAction =
  | "JOB_CREATED"
  | "ROW_PROCESSED"
  | "JOB_COMPLETED"
  | "JOB_COMPLETED_WITH_ERRORS";

export type AuditEntityType = "JOB" | "ROW";

export type PerformedBy = "Analyst" | "System" | "Admin";

type CreateAuditLogInput = {
  uploadJobId: Types.ObjectId;
  action: AuditAction;
  performedBy: PerformedBy;
  entityType: AuditEntityType;

  excelRowNumber?: number;
  transactionId?: string;
  status?:
    | "MATCHED"
    | "UNMATCHED"
    | "PARTIAL"
    | "DUPLICATE"
    | "SUCCESS"
    | "FAILED";

  // Message / summary
  details?: string;

  // Flexible extra data (future-proof)
  meta?: Record<string, any>;
};

/**
 * Create a single audit log entry
 * IMPORTANT: Audit logging must NEVER break main flow
 */
export const createAuditLog = async (data: CreateAuditLogInput) => {
  try {
    await AuditLogModel.create({
      uploadJobId: data.uploadJobId,
      action: data.action,
      performedBy: data.performedBy,
      entityType: data.entityType,
      excelRowNumber: data.excelRowNumber ?? null,
      transactionId: data.transactionId ?? null,
      status: data.status ?? null,
      details: data.details ?? null,
      meta: data.meta ?? {},
    });
  } catch (error) {
    // Audit failures should not stop business logic
    console.error("Audit log creation failed:", error);
  }
};

/**
 * Optional helper for bulk row audit logs (performance-friendly)
 */
export const createAuditLogsBulk = async (logs: CreateAuditLogInput[]) => {
  try {
    if (!logs.length) return;

    await AuditLogModel.insertMany(
      logs.map((log) => ({
        uploadJobId: log.uploadJobId,
        action: log.action,
        performedBy: log.performedBy,
        entityType: log.entityType,
        excelRowNumber: log.excelRowNumber ?? null,
        transactionId: log.transactionId ?? null,
        status: log.status ?? null,
        details: log.details ?? null,
        meta: log.meta ?? {},
      })),
      { ordered: false },
    );
  } catch (error) {
    console.error("Bulk audit log creation failed:", error);
  }
};
