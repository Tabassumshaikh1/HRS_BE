import { IUser } from "./user.interface";

export interface IAddress {
  _id: string;
  name: string;
  flatNo?: string;
  streetName: string;
  area: string;
  pincode: number;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  isPrimary?: boolean;
  user?: string | IUser;
  createdAt: string | Date;
  updatedAt: string | Date;
}
