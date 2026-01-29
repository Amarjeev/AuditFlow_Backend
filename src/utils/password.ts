import bcrypt from "bcrypt";
import { AppError } from "./AppError";

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string) => {
  if (!password) {
    throw new AppError("Password is required for hashing", 400);
  }

  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
