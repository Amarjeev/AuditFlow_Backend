import { Request, Response } from "express";
import jobsService from "./service/upload-Jobs.service";
import { JobsServicePayload } from "./service/upload-Jobs.service";
import { createFileHash } from "../../utils/fileFingerprint.service";
import { AppError } from "../../utils/AppError";
import getJobsService from "./service/get-Jobs.service";
import getReconciliationJobDataService from "./service/getReconciliationJobData.service";
import deleteJobsService from "./service/delete-Jobs.service";

export const uploadJobController = async (req: Request, res: Response) => {
  const file = req.file;
  const { mapping } = req.body;
  const { userId } = (req as any).user;

  // 2. Create fingerprint
  if (!req.file?.path) {
    throw new AppError("File path is missing", 400);
  }
  const fileHash = createFileHash(req.file.path);

  const response = await jobsService({
    file,
    mapping,
    fileHash,
    userId,
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


export const deleteJobController = async (
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

  const response = await deleteJobsService({ jobId, userId, role });
  res.status(200).send(response);
};