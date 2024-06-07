import { Request } from "express";
import {
  AppMessages,
  CommonConst,
  HttpStatus,
  MongooseExcludedKeys,
  QueryBuilderKeys,
  SortBy,
  UserStatus,
  ValidationKeys,
} from "../data/app.constants";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";
import User from "../models/user.model";
import { buildQuery } from "./util.service";
import { IUser } from "../interfaces/user.interface";
import { AppError } from "../classes/app-error.class";
import validate from "../validators/validation";

const getDrivers = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.DRIVER_LIST, req, { sort: "name", sortBy: SortBy.ASC } as IQuery);

  const drivers = await User.find(query)
    .select(MongooseExcludedKeys.PASSWORD)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await User.countDocuments(query);

  return {
    data: drivers,
    total,
  };
};

const getSingleDriver = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ _id: id }).select(MongooseExcludedKeys.PASSWORD);
};

const updateDriver = async (id: string, reqBody: IUser): Promise<any> => {
  const payload: any = {
    name: reqBody.name || CommonConst.EMPTY_STRING,
    userName: reqBody.userName || CommonConst.EMPTY_STRING,
    email: reqBody.email || CommonConst.EMPTY_STRING,
    contactNumber: reqBody.contactNumber || CommonConst.EMPTY_STRING,
    licenseNumber: reqBody.licenseNumber || CommonConst.EMPTY_STRING,
    profileImage: reqBody.profileImage || CommonConst.EMPTY_STRING,
  };
  if (reqBody.status) {
    payload.status = reqBody.status;
  }
  const errorMessage = validate(ValidationKeys.UPDATE_DRIVER, payload);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const driver = await getSingleDriver(id);
  if (!driver) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DRIVER_NOT_EXIST);
  }

  return await User.findByIdAndUpdate(id, payload);
};

const deleteDriver = async (id: string): Promise<any> => {
  const driver = await getSingleDriver(id);
  if (!driver) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DRIVER_NOT_EXIST);
  }

  await User.deleteOne({ _id: id });
  return { _id: id };
};

export { getDrivers, getSingleDriver, updateDriver, deleteDriver };
