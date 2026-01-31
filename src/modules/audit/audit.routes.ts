import { Router } from "express";
import { getAuditLogsController } from "./audit.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const auditRouter = Router();

auditRouter.get(
  "/logs",
  authMiddleware(["admin", "analyst"]),
  getAuditLogsController,
);

export default auditRouter;
