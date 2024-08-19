import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppDefaults, AppMessages, CommonConst, HttpStatus, QueryBuilderKeys, SortBy, ValidationKeys } from "../data/app.constants";
import { IAddress } from "../interfaces/address.interface";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";
import Address from "../models/address.model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";

const getAllAddress = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.ADDRESS, req, {
    sort: AppDefaults.SORT,
    sortBy: SortBy.ASC,
  } as IQuery);

  const allAddress = await Address.find(query)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await Address.countDocuments(query);

  return {
    data: allAddress,
    total,
  };
};

const addAddress = async (req: Request): Promise<IAddress> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.ADDRESS, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Saving data in DB
  const addUserAddress = new Address({
    name: req.body.name || CommonConst.EMPTY_STRING,
    flatNo: req.body.flatNo || CommonConst.EMPTY_STRING,
    streetName: req.body.streetName || CommonConst.EMPTY_STRING,
    area: req.body.area || CommonConst.EMPTY_STRING,
    pincode: req.body.pincode || CommonConst.EMPTY_STRING,
    city: req.body.city || CommonConst.EMPTY_STRING,
    state: req.body.state || CommonConst.EMPTY_STRING,
    lat: req.body.lat || CommonConst.EMPTY_STRING,
    lng: req.body.lng || CommonConst.EMPTY_STRING,
    user: req.user._id || CommonConst.EMPTY_STRING,
  });
  return await addUserAddress.save();
};

const getAddressById = async (id: string): Promise<IAddress | null> => {
  return await Address.findOne({ _id: id });
};

const updateAddress = async (req: Request): Promise<any> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.ADDRESS, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const addressExists = await getAddressById(req.params.id);
  if (!addressExists) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_EXISTS);
  }
  if (req.user._id !== addressExists.user?.toString()) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_ASSOSIATED_USER);
  }
  return await Address.findByIdAndUpdate(req.params.id, req.body);
};

const deleteAddress = async (req: Request): Promise<any> => {
  const addressExists = await getAddressById(req.params.id);
  if (!addressExists) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_EXISTS);
  }
  if (req.user._id !== addressExists.user?.toString()) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_ASSOSIATED_USER);
  }
  if (addressExists.isPrimary) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_PRIMARY);
  }
  await Address.deleteOne({ _id: req.params.id });

  return { _id: req.params.id };
};
const makeAddressPrimary = async (req: Request): Promise<any> => {
  const addressExists = await getAddressById(req.params.id);
  if (!addressExists) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_EXISTS);
  }
  if (req.user._id !== addressExists.user?.toString()) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_ASSOSIATED_USER);
  }

  await Address.updateMany({ user: req.user._id }, { isPrimary: false });

  return await Address.findByIdAndUpdate(req.params.id, { isPrimary: true });
};

export { addAddress, deleteAddress, getAddressById, getAllAddress, makeAddressPrimary, updateAddress };
