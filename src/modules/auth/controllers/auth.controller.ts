import { Request, Response } from "express";
import authService from "../auth.service";

const authController = async (req: Request, res: Response) => {

  const response = await authService(req.body);

  const { accessToken, refreshToken } = response;

  res.cookie("ACCESS_TOKEN", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("REFRESH_TOKEN", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).send({
    success: true,
    message: "Login successful",
  });
};
export default authController;
