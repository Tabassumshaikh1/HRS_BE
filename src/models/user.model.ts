import { Schema, model } from "mongoose";
import { SchemaNames, ActivityStatus, AccountType } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    userName: { type: String },
    email: { type: String, required: true },
    contactNumber: { type: String },
    licenseNumber: { type: String },
    role: { type: String, required: true },
    password: { type: String, required: true },
    imageUrl: { type: String },
    googleId: { type: String },
    accountType: { type: String, default: AccountType.LOCAL },
    status: { type: String, default: ActivityStatus.INACTIVE },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = model<IUser>(SchemaNames.USER, userSchema);
export default User;
