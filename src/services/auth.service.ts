import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { AppError } from "../classes/app-error.class";
import { AppDefaults, AppMessages, CommonConst, HttpStatus, ActivityStatus, ValidationKeys } from "../data/app.constants";
import { ILoginCredentials } from "../interfaces/login.interface";
import { ILoginResponse } from "../interfaces/response.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { cacheGetItem, cacheRemoveItem, cacheSetItem } from "./cache.service";
import { compareBcryptValue } from "./util.service";

const login = async (reqBody: ILoginCredentials): Promise<ILoginResponse> => {
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.LOGIN, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is user already exist
  let user: any = await User.findOne({
    $or: [{ email: reqBody.userName }, { userName: reqBody.userName }, { contactNumber: reqBody.userName }],
  });
  if (!user || !(await compareBcryptValue(reqBody.password, user.password))) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_CREDENTIALS);
  }

  // Checking is account active
  if (user.status === ActivityStatus.INACTIVE) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ACCOUNT_INACTIVE);
  }

  const userId: string = user._id.toString();

  // Checking is if user info and token already exist in cache
  if (cacheGetItem(userId)) {
    return cacheGetItem(userId) as ILoginResponse;
  }

  user = { ...user.toJSON(), _id: user?._id?.toString(), password: undefined };

  // Creating token
  const token = jwt.sign({ userId }, process.env.TOKEN_SECRET_KEY || CommonConst.EMPTY_STRING, {
    expiresIn: AppDefaults.JWT_TOKEN_EXPIRES_IN,
  });
  cacheSetItem(userId, { token, user }, AppDefaults.ONE_DAY_IN_MILLISECONDS);
  return { token, user };
};

const logout = (req: Request) => {
  if (req.user._id) {
    // Removing token from cache
    cacheRemoveItem(req.user._id as string);
  }
  return true;
};

export { login, logout };
