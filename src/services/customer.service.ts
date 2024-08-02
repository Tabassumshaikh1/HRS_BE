import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import {
  AppMessages,
  CommonConst,
  HttpStatus,
  MongooseExcludedKeys,
  QueryBuilderKeys,
  SortBy,
  ValidationKeys,
} from "../data/app.constants";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";

const getCustomers = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.CUSTOMER_LIST, req, { sort: CommonConst.Name, sortBy: SortBy.ASC } as IQuery);

  const customers = await User.find(query)
    .select([MongooseExcludedKeys.PASSWORD, MongooseExcludedKeys.GOOGLE_ID])
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await User.countDocuments(query);

  return {
    data: customers,
    total,
  };
};

const getSingleCustomer = async (id: string): Promise<IUser | null> => {
  return await User.findOne({ _id: id }).select([MongooseExcludedKeys.PASSWORD, MongooseExcludedKeys.GOOGLE_ID]);
};

const updateCustomerStatus = async (id: string, reqBody: IUser): Promise<any> => {
  const payload: any = {
    status: reqBody.status || CommonConst.EMPTY_STRING,
  };

  const errorMessage = validate(ValidationKeys.UPDATE_ACTIVITY_STATUS, payload);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const customer = await getSingleCustomer(id);
  if (!customer) {
    throw new AppError(HttpStatus.NOT_FOUND, AppMessages.CUSTOMER_NOT_EXIST);
  }

  return await User.findByIdAndUpdate(id, payload);
};

export { getCustomers, getSingleCustomer, updateCustomerStatus };
