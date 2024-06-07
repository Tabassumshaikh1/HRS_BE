import { Schema, model } from "mongoose";
import { SchemaNames, UserStatus } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true, unique: true },
    licenseNumber: { type: String, required: false },
    role: { type: String, required: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    status: { type: String, default: UserStatus.INACTIVE },
  },
  {
    timestamps: true,
  }
);

const User = model<IUser>(SchemaNames.USER, userSchema);
export default User;
