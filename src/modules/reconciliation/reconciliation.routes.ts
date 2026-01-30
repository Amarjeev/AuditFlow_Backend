import { Router } from "express";
import { getReconciliationDashboardController ,getReconciliationChartDataController} from "./reconciliation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const reconciliationDashboardRouter = Router();

reconciliationDashboardRouter.get(
  "/dashboard",
  authMiddleware(["admin"]),
  getReconciliationDashboardController,
);

reconciliationDashboardRouter.get(
  "/chart",
  authMiddleware(["admin"]),
  getReconciliationChartDataController,
);

export default reconciliationDashboardRouter;
