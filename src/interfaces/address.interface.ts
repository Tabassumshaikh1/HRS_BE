import { IUser } from "./user.interface";

export interface IAddress {
    _id: string;
    name: string;
    streetName: string;
    state : string;
    pincode : number;
    city : string;
    flatNo : string;
    isPrimary?: boolean;
    user?: string | IUser;
    createdAt: string | Date;
    updatedAt: string | Date;

}