import { AuthRole } from "./../../utils/jwt";
import { AppError } from "../../utils/AppError";
import AdminProfileModel from "../../schema/adminProfile.model";
import { verifyPassword } from "../../utils/password";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";

const authService = async (payload: {
  username: string;
  password: string;
  role: AuthRole;
}) => {
  const { username, password, role } = payload;

  const userRole = role.toLowerCase() as AuthRole;

  const adminProfile = await AdminProfileModel.findOne({
    isDeleted: false,
  }).lean();

  if (!adminProfile) {
    throw new AppError("Admin profile not found", 404);
  }

  if (adminProfile?.username?.toLowerCase() !== username.trim().toLowerCase()) {
    throw new AppError("Invalid username or password", 401);
  }

  const isPasswordValid = await verifyPassword(
    password,
    adminProfile?.password,
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid username or password", 401);
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
