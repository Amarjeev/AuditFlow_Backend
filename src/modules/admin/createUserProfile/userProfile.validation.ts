import { body } from "express-validator";

export const userProfileValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Enter a valid 10-digit Indian mobile number"),

  body("password")
    .trim()
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),

  body("role")
    .trim()
    .toLowerCase()
    .isIn(["admin", "analyst", "viewer"])
    .withMessage("Role must be admin, analyst, or viewer"),
];
