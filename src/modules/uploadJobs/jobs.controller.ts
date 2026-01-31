import { Request, Response } from "express";
import jobsService from "./service/upload-Jobs.service";
import { JobsServicePayload } from "./type/uploadJobs.type";
import { createFileHashFromBuffer } from "../../utils/createFileId.service";
import { AppError } from "../../utils/AppError";
import getJobsService from "./service/get-Jobs.service";
import getReconciliationJobDataService from "./service/getReconciliationJobData.service";
import deleteJobsService from "./service/delete-Jobs.service";

export const uploadJobController = async (req: Request, res: Response) => {
  const file = req.file;
  const { mapping } = req.body;
  const { userId, role } = (req as any).user;

  // 2. Create fingerprint
   if (!file || !file.buffer) {
    throw new AppError("File is required", 400);
  }

  const fileHash = createFileHashFromBuffer(file.buffer);

  const response = await jobsService({
    file,
    mapping,
    fileHash,
    userId,
    role,
  } as JobsServicePayload);

  res.status(200).send(response);
};

export const getuploadJobsController = async (req: Request, res: Response) => {
  const { userId, role } = (req as any).user;

  if (!userId || !role) {
    throw new AppError(
      "Unauthorized access. User information is missing.",
      401,
    );
  }

  const response = await getJobsService({ userId, role });

  res.status(200).send(response);
};

export const getReconciliationJobDataController = async (
  req: Request,
  res: Response,
) => {
  const { userId, role } = (req as any).user;
  const { jobId } = req.params as { jobId: string };

  if (!userId || !role) {
    throw new AppError(
      "Unauthorized access. User information is missing.",
      401,
    );
  }

  const response = await getReconciliationJobDataService(jobId);
  res.status(200).send(response);
};

export const deleteJobController = async (req: Request, res: Response) => {
  const { userId, role } = (req as any).user;
  const { jobId } = req.params as { jobId: string };

  if (!userId || !role) {
    throw new AppError(
      "Unauthorized access. User information is missing.",
      401,
    );
  }

  const response = await deleteJobsService({ jobId, userId, role });
  res.status(200).send(response);
};
