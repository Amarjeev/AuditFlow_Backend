import { Request, Response } from "express";
import { AppError } from "../../../utils/AppError";
import {
  verifyRefreshToken,
  verifyAccessToken,
  generateAccessToken,
} from "../../../utils/jwt";

const checkAuthStatusController = (req: Request, res: Response) => {
  const accessToken = req.cookies?.ACCESS_TOKEN;
  const refreshToken = req.cookies?.REFRESH_TOKEN;

  if (!accessToken && !refreshToken) {
    throw new AppError("Authentication required", 403);
  }

  let decoded: any;

  if (accessToken && refreshToken) {
    decoded = verifyAccessToken(accessToken);
  }

  if (!decoded && refreshToken) {
    const refreshDecoded = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken(
      refreshDecoded.userId,
      refreshDecoded.name,
      refreshDecoded.role,
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("ACCESS_TOKEN", newAccessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    decoded = refreshDecoded;
  }

  return res.status(200).json({
    role: decoded?.role,
  });
};

export default checkAuthStatusController;
