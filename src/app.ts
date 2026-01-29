import express from "express";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";

import { globalErrorHandler } from "./middlewares/error.middleware";
import AdminProfileRouter from "./modules/admin/profile/adminProfile.routes";
import authRouter from "./modules/auth/auth.routes";
import uploadJobRouter from "./modules/uploadJobs/jobs.routes";

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

app.use("/api/v1/admin/profile", AdminProfileRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", uploadJobRouter);

app.use(globalErrorHandler);

export default app;
