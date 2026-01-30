import { userProfileValidation } from "./userProfile.validation";
import {
  createUserProfileController,
  getUserProfileController,
  deleteUserProfileController,
} from "./userProfile.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { authMiddleware } from "../../../middlewares/auth.middleware";
import Router from "express";

const userProfileRouter = Router();

userProfileRouter.post(
  "/profile-create",
  authMiddleware(["admin"]),
  userProfileValidation,
  validate,
  createUserProfileController,
);

userProfileRouter.get(
  "/profiles",
  authMiddleware(["admin"]),
  getUserProfileController,
);

userProfileRouter.post(
  "/delete/:id",
  authMiddleware(["admin"]),
  deleteUserProfileController,
);

export default userProfileRouter;
