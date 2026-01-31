import { body } from "express-validator";

export const loginValidation = [
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isMobilePhone("en-IN")
    .withMessage("Invalid mobile number"),

  body("password").trim().notEmpty().withMessage("Password is required"),
  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "analyst", "viewer"])
    .withMessage("Invalid role"),
];
