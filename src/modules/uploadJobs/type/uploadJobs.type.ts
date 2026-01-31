import { Types } from "mongoose";

export type deleteJobsPayload = {
  userId?: string;
  role?: "admin" | "analyst" | "viewer";
  jobId: string;
};

export type GetJobsPayload = {
  userId?: string;
  role?: "admin" | "analyst" | "viewer";
};

export type ReconciliationJobPayload = {
  uploadJobId: Types.ObjectId;
  mapping?: Record<string, string> | null;
  fileBuffer: Buffer;
};

export type JobsServicePayload = {
  file: Express.Multer.File;
  fileHash: string;
  mapping: string;
  userId: string;
  role: string;
};

export type ValidateJobUploadPayload = {
  file?: Express.Multer.File;
  mapping?: string;
};
