import createAdminProfileController from "./adminProfile.controller";
import { adminProfileValidation } from "./adminProfile.validation";
import { validate } from "../../../middlewares/validate.middleware";
import Router from "express";

const AdminProfileRouter = Router();

AdminProfileRouter.post(
  "/create",
  adminProfileValidation,
  validate,
  createAdminProfileController,
);

export default AdminProfileRouter;
