import jwt, { JwtPayload as JwtBasePayload } from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

export enum UserRoles {
  ADMIN = "admin",
  ANALYST = "analyst",
  VIEWER = "viewer",
}

export type AuthRole = "admin" | "analyst" | "viewer";

interface AuthPayload extends JwtBasePayload {
  userId: string;
  name: string;
  role: AuthRole;
}

/*  Access Token */
export const generateAccessToken = (
  userId: string,
  name: string,
  role: AuthRole,
) => {
  return jwt.sign({ userId, role, name }, ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

/* Refresh Token */
export const generateRefreshToken = (
  userId: string,
  name: string,
  role: AuthRole,
) => {
  return jwt.sign({ userId, role, name }, REFRESH_SECRET, {
    expiresIn: "5d",
  });
};

/* Verify access token */
export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, ACCESS_SECRET) as AuthPayload;
};

/* Verify refresh token */
export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, REFRESH_SECRET) as AuthPayload;
};
