import { body } from "express-validator";

export const authValidation = [
  body("username").trim().notEmpty().withMessage("Username is required"),

  body("password").trim().notEmpty().withMessage("Password is required"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "analyst", "viewer"])
    .withMessage("Invalid role"),
];
