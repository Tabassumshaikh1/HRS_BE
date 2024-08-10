import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppDefaults, AppMessages, HttpStatus, QueryBuilderKeys, SortBy, ValidationKeys } from "../data/app.constants";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";

import VehicleType from "../models/vehicleType.model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";
import Vehicle from "../models/vehicle.model";
import { IAddress } from "../interfaces/address.interface";
import Address from "../models/address.model";

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
    name : req.body.name,
    user : req.user._id,
    streetName: req.body.streetName,
    state : req.body.state,
    pincode : req.body.pincode,
    city : req.body.city,
    flatNo : req.body.flatNo
  });
  return await addUserAddress.save();
};

const getAddressById = async (id: string): Promise<IAddress | null> => {
  return await Address.findOne({ _id: id });
};

const updateAddress = async ( req: Request): Promise<any> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.ADDRESS, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const addressExists = await getAddressById(req.params.id);
  if (!addressExists) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_EXISTS);
  }
  if(req.user._id !== addressExists.user?.toString()) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_ASSOSIATED_USER);
  }
  return await Address.findByIdAndUpdate(req.params.id, req.body);
};

const deleteAddress = async (req: Request): Promise<any> => {
  const addressExists = await getAddressById(req.params.id);
  if (!addressExists) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_EXISTS);
  }
  if(req.user._id !== addressExists.user?.toString()) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_ASSOSIATED_USER);
  }
  if(addressExists.isPrimary) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_PRIMARY);
  }
  await Address.deleteOne({ _id: req.params.id });

  return { _id: req.params.id };
};
const makeAddressPrimary =  async (req: Request): Promise<any> => {

  const addressExists = await getAddressById(req.params.id);
  if (!addressExists) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_EXISTS);
  }
  if(req.user._id !== addressExists.user?.toString()) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.ADDRESS_NOT_ASSOSIATED_USER);
  }

  return await Address.findByIdAndUpdate(req.params.id, {isPrimary: true});
  };

export { addAddress, getAddressById,updateAddress,deleteAddress,getAllAddress,makeAddressPrimary};
