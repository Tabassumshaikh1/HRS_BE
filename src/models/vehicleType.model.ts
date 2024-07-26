import { Schema, model } from "mongoose";
import { SchemaNames } from "../data/app.constants";
import { IVehicleType } from "../interfaces/vehicleType.interface";

const vehicleTypeSchema = new Schema<IVehicleType>(
  {
    name: { type: String, required: true, unique: true }
  },
  {
    timestamps: true,
  }
);

const VehicleType = model<IVehicleType>(SchemaNames.VEHICLETYPE, vehicleTypeSchema);
export default VehicleType;
