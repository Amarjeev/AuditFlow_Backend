import { IAdminProfile } from "./adminProfile.model";
import { hashPassword } from "../../../utils/password";
import AdminProfileModel from "./adminProfile.model";

const adminProfileService = async (payload: IAdminProfile) => {
  const { name, username, password } = payload;

  const hashedPassword = await hashPassword(password);

  const adminProfileData: IAdminProfile = {
    name,
    username,
    password: hashedPassword,
  };

  //only one admin profile is allowed
  const existAdminProfile = await AdminProfileModel.countDocuments({
    isDeleted: false,
  });
  if (existAdminProfile >= 1) {
    return {
      success: false,
      message: "Admin profile already exists",
    };
  }

  await AdminProfileModel.create(adminProfileData);

  return {
    success: true,
    message: "Admin profile created successfully",
  };
};


export default adminProfileService;