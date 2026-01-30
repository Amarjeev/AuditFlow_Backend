import userProfileModel from "../../../../schema/userProfile.model";
import { AppError } from "../../../../utils/AppError";

const deleteUserProfileService = async (id: string) => {
  if (!id.trim()) {
    throw new AppError("User id is required", 400);
  }

  const user = await userProfileModel.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role === "admin") {
    throw new AppError("Admin user cannot be deleted", 403);
  }

  user.isDeleted = true;
  await user.save();

  return {
    message: "User deleted successfully",
    success: true,
  };
};

export default deleteUserProfileService;
