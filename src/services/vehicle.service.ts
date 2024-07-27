import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import {
  ActivityStatus,
  AppMessages,
  CommonConst,
  HttpStatus,
  PopulateKeys,
  QueryBuilderKeys,
  SortBy,
  ValidationKeys,
} from "../data/app.constants";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IVehicle } from "../interfaces/vehicle.interface";
import Vehicle from "../models/vehicle.model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";
import { removeFileFromFirebase } from "./file-upload.service";

const getVehicles = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.VEHICLE_LIST, req, {
    sort: CommonConst.VEHICLE_NUMBER,
    sortBy: SortBy.ASC,
  } as IQuery);

  const vehicles = await Vehicle.find(query)
    .populate(PopulateKeys.VEHICLE_TYPE)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await Vehicle.countDocuments(query);

  return {
    data: vehicles,
    total,
  };
};

const createVehicle = async (reqBody: IVehicle): Promise<IVehicle> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.VEHICLE, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Saving data in DB
  const vehicle = new Vehicle({
    vehicleNumber: reqBody.vehicleNumber || CommonConst.EMPTY_STRING,
    company: reqBody.company || CommonConst.EMPTY_STRING,
    capacity: reqBody.capacity || CommonConst.EMPTY_STRING,
    vehicleType: reqBody.vehicleType || CommonConst.EMPTY_STRING,
    mfgYear: reqBody.mfgYear || CommonConst.EMPTY_STRING,
    chassisNumber: reqBody.chassisNumber || CommonConst.EMPTY_STRING,
    regNumber: reqBody.regNumber || CommonConst.EMPTY_STRING,
    imageUrl: reqBody.imageUrl || CommonConst.EMPTY_STRING,
    status: reqBody.status || ActivityStatus.ACTIVE,
  });
  return (await vehicle.save()).populate(PopulateKeys.VEHICLE_TYPE);
};

const getSingleVehicle = async (id: string): Promise<IVehicle | null> => {
  return await Vehicle.findOne({ _id: id }).populate(PopulateKeys.VEHICLE_TYPE);
};

const updateVehicle = async (id: string, reqBody: IVehicle): Promise<any> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.VEHICLE, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const vehicle = await getSingleVehicle(id);
  if (!vehicle) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.VEHICLE_NOT_EXIST);
  }

  if (!reqBody.imageUrl) {
    delete reqBody.imageUrl;
  }

  return await Vehicle.findByIdAndUpdate(id, reqBody).populate(PopulateKeys.VEHICLE_TYPE);
};

const deleteVehicle = async (id: string): Promise<any> => {
  const vehicle = await getSingleVehicle(id);
  if (!vehicle) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.VEHICLE_NOT_EXIST);
  }

  await Vehicle.deleteOne({ _id: id });
  if (vehicle?.imageUrl) {
    await removeFileFromFirebase(vehicle?.imageUrl);
  }
  return { _id: id };
};
const updateVehicleStatus = async (id: string, reqBody: IVehicle): Promise<any> => {
  const payload: any = {
    status: reqBody.status || CommonConst.EMPTY_STRING,
  };

  const errorMessage = validate(ValidationKeys.UPDATE_USER_STATUS, payload);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const driver = await getSingleVehicle(id);
  if (!driver) {
    throw new AppError(HttpStatus.NOT_FOUND, AppMessages.DRIVER_NOT_EXIST);
  }

  return await Vehicle.findByIdAndUpdate(id, payload);
};
export { createVehicle, deleteVehicle, getSingleVehicle, getVehicles, updateVehicle,updateVehicleStatus };
