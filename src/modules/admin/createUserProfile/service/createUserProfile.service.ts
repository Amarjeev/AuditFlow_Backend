import userProfileModel from "../../../../schema/userProfile.model";
import { IUserProfile } from "../../../../interfaces/userProfile.interface";
import { AppError } from "../../../../utils/AppError";
import { AuthRole } from "../../../../utils/jwt";
import { hashPassword } from "../../../../utils/password";

const createUserProfileService = async (payload: IUserProfile) => {
  const { name, mobile, password, role } = payload;

  const mobileExist = await userProfileModel
    .findOne({
      isDeleted: false,
      mobile,
    })
    .lean()
    .select("_id");

  if (mobileExist) {
    throw new AppError("Mobile number already exists", 409);
  }

  const hashedPassword = await hashPassword(password);

  if (role?.toLowerCase()?.trim() === "admin") {
    //only one admin profile is allowed
    const existAdminProfile = await userProfileModel.countDocuments({
      role: "admin",
      isDeleted: false,
    });
    if (existAdminProfile >= 1) {
      return {
        success: false,
        message: "only one Admin profile is allowed",
      };
    }
  }

  const normalizedRole = role?.trim().toLowerCase() as AuthRole;

  const userProfileData: IUserProfile = {
    name,
    mobile,
    password: hashedPassword,
    role: normalizedRole,
  };

  await userProfileModel.create(userProfileData);

  return {
    success: true,
    message: "Profile created successfully",
  };
};

export default createUserProfileService;
