import { Request, Response } from "express";
import { verifyRefreshToken, generateAccessToken } from "../../../utils/jwt";
import { AppError } from "../../../utils/AppError";
import userProfileModel from "../../../schema/userProfile.model";
import { clearAuthCookie } from "../../../utils/cookies";

const refreshTokenController = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.REFRESH_TOKEN;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401);
  }

  const decoded = verifyRefreshToken(refreshToken);
  const { userId, username, role } = decoded;

  let userExist: any = null;

  switch (role) {
    case "admin":
      userExist = await userProfileModel
        .findOne({ isDeleted: false, _id: userId })
        .lean();
      break;

    case "analyst":
      userExist = await userProfileModel
        .findOne({ isDeleted: false, _id: userId })
        .lean();
      break;

    case "viewer":
      userExist = await userProfileModel
        .findOne({ isDeleted: false, _id: userId })
        .lean();
      break;

    default:
      throw new AppError("Invalid role", 400);
  }

  if (!userExist) {
    clearAuthCookie(res);
    throw new AppError("Session expired. Please login again.", 401);
  }

  const newAccessToken = generateAccessToken(userId, username, role);

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("ACCESS_TOKEN", newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "Access token refreshed",
  });
};

export default refreshTokenController;
