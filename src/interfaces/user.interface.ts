import { UserRoles, UserStatus } from "../data/app.constants";

export interface IUser {
  _id?: number | string;
  name: string;
  email?: string;
  contactNumber: string;
  userName: string;
  password: string;
  licenseNumber?: string;
  role: UserRoles.ADMIN | UserRoles.DRIVER | UserRoles.CUSTOMER;
  profileImage?: string;
  status?: `${UserStatus}`;
  createdAt: Date;
  updatedAt: Date;
}
