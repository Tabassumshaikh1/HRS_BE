import { Schema, model } from "mongoose";
import { SchemaNames } from "../data/app.constants";
import { IVehicleType } from "../interfaces/vehicle-type.interface";

const vehicleTypeSchema = new Schema<IVehicleType>(
  {
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const VehicleType = model<IVehicleType>(SchemaNames.VEHICLE_TYPE, vehicleTypeSchema);
export default VehicleType;
