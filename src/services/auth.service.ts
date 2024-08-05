import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { AppError } from "../classes/app-error.class";
import {
  AppDefaults,
  AppMessages,
  CommonConst,
  HttpStatus,
  ActivityStatus,
  ValidationKeys,
  UserRoles,
  AccountType,
  MongooseExcludedKeys,
} from "../data/app.constants";
import { ILoginCredentials } from "../interfaces/login.interface";
import { ILoginResponse } from "../interfaces/response.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { cacheGetItem, cacheRemoveItem, cacheSetItem } from "./cache.service";
import { bcryptValue, compareBcryptValue } from "./util.service";
import { IUser } from "../interfaces/user.interface";

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

const signInWithGoogle = async (reqBody: IUser) => {
  reqBody.password = reqBody.googleId as string;
  // Validating user before saving into DB
  const errorMessage = validate(ValidationKeys.NEW_USER, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Checking is user already exist
  let existingUser = await User.findOne({
    $or: [{ email: reqBody.email }, { userName: reqBody.userName }, { contactNumber: reqBody.contactNumber }],
    $and: [{ googleId: reqBody.googleId }],
  });

  if (existingUser?.id) {
    return await login({
      userName: reqBody.email,
      password: reqBody.password,
    } as ILoginCredentials);
  } else {
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
      role: UserRoles.CUSTOMER,
      imageUrl: reqBody.imageUrl || null,
      googleId: reqBody.googleId || CommonConst.EMPTY_STRING,
      accountType: AccountType.GOOGLE,
      status: ActivityStatus.ACTIVE,
    });
    await user.save();
    return await login({
      userName: reqBody.email,
      password: reqBody.password,
    } as ILoginCredentials);
  }
};

const logout = (req: Request) => {
  if (req.user._id) {
    // Removing token from cache
    cacheRemoveItem(req.user._id as string);
  }
  return true;
};

const updateMe = async (req: Request): Promise<any> => {
  // Validating update before saving into DB
  const payload: any = {
    name: req.body.name || CommonConst.EMPTY_STRING,
    userName: req.body.userName || CommonConst.EMPTY_STRING,
    email: req.body.email || CommonConst.EMPTY_STRING,
    contactNumber: req.body.contactNumber || CommonConst.EMPTY_STRING,
    licenseNumber: req.body.licenseNumber || CommonConst.EMPTY_STRING,
  };
  if (req.body.imageUrl) {
    payload.imageUrl = req.body.imageUrl;
  }
  const errorMessage = validate(ValidationKeys.UPDATE_ME, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }
  return await User.findByIdAndUpdate(req.user._id, payload).select(MongooseExcludedKeys.PASSWORD);
};

export { login, logout, signInWithGoogle,updateMe };
