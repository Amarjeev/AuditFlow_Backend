import { body } from "express-validator";

export const adminProfileValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Name must be between 3 and 20 characters")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 15 })
    .withMessage("Username must be between 4 and 15 characters"),

  body("password")
    .trim()
    .optional()
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters"),
];
