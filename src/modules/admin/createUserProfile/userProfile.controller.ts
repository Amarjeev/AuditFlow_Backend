import { Request, Response } from "express";
import createUserProfileService from "./service/createUserProfile.service";
import getUserProfileService from "./service/getUserProfile.service";
import deleteUserProfileService from "./service/deleteUserProfile.service";

export const createUserProfileController = async (
  req: Request,
  res: Response,
) => {
  const response = await createUserProfileService(req.body);
  return res.status(201).send(response);
};

export const getUserProfileController = async (req: Request, res: Response) => {
  const response = await getUserProfileService();
  return res.status(201).send(response);
};

export const deleteUserProfileController = async (
  req: Request,
  res: Response,
) => {
  const { id } = req.params as { id: string };

  const response = await deleteUserProfileService(id);
  return res.status(201).send(response);
};
