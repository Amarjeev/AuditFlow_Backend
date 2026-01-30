import userProfileModel from "../../../../schema/userProfile.model";

const getUserProfileService = async () => {
  const profileData = await userProfileModel
    .find({
      isDeleted: false,
    })
    .lean()
    .select("name role mobile");

  return profileData;
};

export default getUserProfileService;
