import { AuthRole } from "./../../utils/jwt";
import { AppError } from "../../utils/AppError";
import userProfileModel from "../../schema/userProfile.model";
import { verifyPassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

const authService = async (payload: {
  mobile: string;
  password: string;
  role: AuthRole;
}) => {
  const { mobile, password, role } = payload;

  const userRole = role.toLowerCase() as AuthRole;

  const adminProfile = await userProfileModel
    .findOne({
      mobile,
      isDeleted: false,
    })
    .lean();

  if (!adminProfile) {
    throw new AppError("User profile not found", 404);
  }

  const isPasswordValid = await verifyPassword(
    password,
    adminProfile?.password,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid MobileNumber or password", 401);
  }

  const accessToken = generateAccessToken(
    adminProfile?._id?.toString(),
    adminProfile?.name,
    userRole,
  );

  const refreshToken = generateRefreshToken(
    adminProfile?._id?.toString(),
    adminProfile?.name,
    userRole,
  );

  if (!accessToken || !refreshToken) {
    throw new AppError("Token generation failed", 500);
  }

  return { accessToken, refreshToken };
};

export default authService;
