import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";

import { globalErrorHandler } from "./middlewares/error.middleware";
import authRouter from "./modules/auth/auth.routes";
import uploadJobRouter from "./modules/uploadJobs/jobs.routes";
import reconciliationDashboardRouter from "./modules/reconciliation/reconciliation.routes";
import userProfileRouter from "./modules/admin/createUserProfile/userProfile.routes";
import auditRouter from "./modules/audit/audit.routes";

const app = express();

const corsOptions: CorsOptions = {
  origin: ["http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", userProfileRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", uploadJobRouter);
app.use("/api/v1/reconciliation", reconciliationDashboardRouter);
app.use("/api/v1/audit", auditRouter);

app.use(globalErrorHandler);

export default app;
