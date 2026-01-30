import { Request, Response } from "express";
import { getReconciliationDashboardService } from "./service/reconciliation.service";
import { getReconciliationChartDataService } from "./service/reconciliationChart.service";

export const getReconciliationDashboardController = async (
  req: Request,
  res: Response,
) => {
  const response = await getReconciliationDashboardService();

  res.status(200).json(response);
};

export const getReconciliationChartDataController = async (
  req: Request,
  res: Response,
) => {
  const response = await getReconciliationChartDataService(req.query);

  res.status(200).json(response);
};
