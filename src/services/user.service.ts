import { AppError } from "../classes/app-error.class";
import { AppMessages, CommonConst, HttpStatus, UserStatus, ValidationKeys } from "../data/app.constants";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { bcryptValue } from "./util.service";

const createUser = async (reqBody: IUser): Promise<IUser> => {
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.NEW_USER, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const userExist: any = await User.findOne({
    $or: [{ email: reqBody.email }, { userName: reqBody.userName }, { contactNumber: reqBody.contactNumber }],
  });
  if (userExist) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.USER_EXIST);
  }

  // Hashing Password before saving into DB
  const hashedPassword = await bcryptValue(reqBody.password);

  // Saving data in DB
  const user = new User({
    name: reqBody.name || CommonConst.EMPTY_STRING,
    userName: reqBody.userName || CommonConst.EMPTY_STRING,
    email: reqBody.email || CommonConst.EMPTY_STRING,
    contactNumber: reqBody.contactNumber || CommonConst.EMPTY_STRING,
    licenseNumber: reqBody.licenseNumber || CommonConst.EMPTY_STRING,
    password: hashedPassword || CommonConst.EMPTY_STRING,
    role: reqBody.role || CommonConst.EMPTY_STRING,
    profileImage: reqBody.profileImage || null,
    // TODO: Default status will be Inactive change it after email verification functionality
    status: reqBody.status || UserStatus.ACTIVE,
  });
  const savedUser: any = await user.save();
  return { ...savedUser.toJSON(), password: undefined };
};

export { createUser };
