import { AuditLogModel } from "../../../schema/auditLog.schema";
import { AppError } from "../../../utils/AppError";
import { CreateAuditLogInput } from "../type/auditLog.types";


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
    throw new AppError("Audit log creation failed:", 500);
  }
};

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
     throw new AppError("Bulk audit log creation failed:", 500);
  }
};
