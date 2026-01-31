import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";
import { authMiddleware } from "../../middlewares/auth.middleware";
import {
  getuploadJobsController,
  getReconciliationJobDataController,
  uploadJobController,
  deleteJobController,
} from "./jobs.controller";

const uploadJobRouter = Router();

uploadJobRouter.post(
  "/upload",
  authMiddleware(["admin", "analyst"]),
  upload.single("file"),
  uploadJobController,
);

uploadJobRouter.get(
  "/upload-jobs",
  authMiddleware(["admin", "analyst"]),
  getuploadJobsController,
);

uploadJobRouter.get(
  "/upload-jobs/:jobId",
  authMiddleware(["admin", "analyst"]),
  getReconciliationJobDataController,
);

uploadJobRouter.post(
  "/delete-job/:jobId",
  authMiddleware(["admin", "analyst"]),
  deleteJobController,
);
export default uploadJobRouter;
