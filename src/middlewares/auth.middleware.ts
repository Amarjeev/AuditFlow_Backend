import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { AuthRole } from "../utils/jwt";
import { AppError } from "../utils/AppError";

export const authMiddleware = (roles: AuthRole | AuthRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.ACCESS_TOKEN;

    if (!token) {
      throw new AppError("Unauthorized: access token missing", 401);
    }

    const decoded = verifyAccessToken(token);

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(decoded.role)) {
      throw new AppError("Forbidden: insufficient permissions", 403);
    }

    //  attach user info
    (req as any).user = decoded;

    next();
  };
};
