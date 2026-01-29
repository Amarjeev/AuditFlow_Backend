import { Request, Response } from "express";
import adminProfileService from "./adminProfile.service";

const createAdminProfileController = async (req: Request, res: Response) => {
  const response = await adminProfileService(req.body);
  return res.status(201).send(response);
};

export default createAdminProfileController;
