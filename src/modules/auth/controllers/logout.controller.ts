import { Request, Response } from "express";
import { clearAuthCookie } from "../../../utils/cookies";

const logoutController = (req: Request, res: Response) => {
  clearAuthCookie(res);

  res.status(200).send({
    success: true,
    message: "logged out successfully",
  });
};

export default logoutController;
