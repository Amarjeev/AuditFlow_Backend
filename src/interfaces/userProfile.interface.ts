import { AuthRole } from "../utils/jwt";

export interface IUserProfile {
  mobile: string;
  name: string;
  password: string;
  isDeleted?: boolean;
  role: AuthRole;
}