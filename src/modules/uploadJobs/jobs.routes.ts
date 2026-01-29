import { Router } from "express";
import { upload } from "../../middlewares/upload.middleware";
import { uploadJobController } from "./jobs.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { getuploadJobsController } from "./jobs.controller";

const uploadJobRouter = Router();

uploadJobRouter.post(
  "/upload",
  authMiddleware(["admin"]),
  upload.single("file"),
  uploadJobController,
);

uploadJobRouter.get(
  "/upload-jobs",
  authMiddleware(["admin"]),
  getuploadJobsController,
);

export default uploadJobRouter;
