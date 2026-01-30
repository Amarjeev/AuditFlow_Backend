import mongoose, { Schema, model } from "mongoose";
import { AuthRole } from "../utils/jwt";

export interface IUserProfile {
  mobile: string;
  name: string;
  password: string;
  isDeleted?: boolean;
  role: AuthRole;
}
// export type AuthRole = "admin" | "analyst" | "viewer";
const userProfileSchema = new Schema<IUserProfile>(
  {
    mobile: { type: String, required: true, trim: true, unique: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin", "analyst", "viewer"] },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const userProfileModel = model<IUserProfile>("Users", userProfileSchema);

export default userProfileModel;
