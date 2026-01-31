import { Router } from "express";
import { getReconciliationDashboardController ,getReconciliationChartDataController} from "./reconciliation.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const reconciliationDashboardRouter = Router();

reconciliationDashboardRouter.get(
  "/dashboard",
  authMiddleware(["admin","viewer"]),
  getReconciliationDashboardController,
);

reconciliationDashboardRouter.get(
  "/chart",
  authMiddleware(["admin","viewer"]),
  getReconciliationChartDataController,
);

export default reconciliationDashboardRouter;
