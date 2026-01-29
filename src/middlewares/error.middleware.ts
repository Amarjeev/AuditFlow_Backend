import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message =
    err.message || "Something went wrong. Please try again later.";
console.error("Error:", message);
  res.status(statusCode).json({
    success: false,
    message,
  });
};
