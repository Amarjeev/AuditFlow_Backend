import mongoose, { Schema, model } from "mongoose";

export interface IAdminProfile {
  name: string;
  username: string;
  password: string;
  isDeleted?: boolean;
  role?: "admin";
}

const adminProfileSchema = new Schema<IAdminProfile>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    role: { type: String, enum: ["admin"], default: "admin" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const AdminProfileModel = model<IAdminProfile>(
  "AdminProfile",
  adminProfileSchema,
);

export default AdminProfileModel;
