import { UserRoles, ActivityStatus, AccountType } from "../data/app.constants";

export interface IUser {
  _id?: number | string;
  name: string;
  email: string;
  contactNumber?: string;
  userName?: string;
  password: string;
  licenseNumber?: string;
  role: `${UserRoles}`;
  imageUrl?: string;
  status?: `${ActivityStatus}`;
  googleId?: string;
  accountType: `${AccountType}`;
  createdAt: Date;
  updatedAt: Date;
}
