import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import { AppDefaults, AppMessages, HttpStatus, QueryBuilderKeys, SortBy, ValidationKeys } from "../data/app.constants";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";
import { IVehicleType } from "../interfaces/vehicle-type.interface";
import VehicleType from "../models/vehicleType.model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";
import Vehicle from "../models/vehicle.model";

const getVehicleTypes = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.VEHICLE_TYPE_LIST, req, {
    sort: AppDefaults.SORT,
    sortBy: SortBy.ASC,
  } as IQuery);

  const vehicleTypes = await VehicleType.find(query)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit);

  const total = await VehicleType.countDocuments(query);

  return {
    data: vehicleTypes,
    total,
  };
};

const addVehicleType = async (reqBody: IVehicleType): Promise<IVehicleType> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.VEHICLE_TYPE, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Saving data in DB
  const vehicleType = new VehicleType({
    name: reqBody.name,
  });
  return await vehicleType.save();
};

const getSingleVehicleType = async (id: string): Promise<IVehicleType | null> => {
  return await VehicleType.findOne({ _id: id });
};

const updateVehicleType = async (id: string, reqBody: IVehicleType): Promise<any> => {
  // Validating vehicle before saving into DB
  const errorMessage = validate(ValidationKeys.VEHICLE_TYPE, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const vehicleType = await getSingleVehicleType(id);
  if (!vehicleType) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.VEHICLE_TYPE_NOT_EXIST);
  }

  return await VehicleType.findByIdAndUpdate(id, reqBody);
};

const deleteVehicleType = async (id: string): Promise<any> => {
  const vehicleType = await getSingleVehicleType(id);
  if (!vehicleType) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.VEHICLE_TYPE_NOT_EXIST);
  }

  const vehicleWithVehicleType = await Vehicle.findOne({ vehicleType: id });
  if (vehicleWithVehicleType) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.VEHICLE_WITH_VEHICLE_TYPE);
  }

  await VehicleType.deleteOne({ _id: id });

  return { _id: id };
};

export { addVehicleType, deleteVehicleType, getSingleVehicleType, getVehicleTypes, updateVehicleType };
