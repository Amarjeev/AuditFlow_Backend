import { Response } from "express";

export const clearAuthCookie = (res: Response) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("ACCESS_TOKEN", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });

  res.clearCookie("REFRESH_TOKEN", {
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
  });
};
