import mongoose, { Schema, model } from "mongoose";
import { SchemaNames, ActivityStatus } from "../data/app.constants";
import { IVehicle } from "../interfaces/vehicle.interface";

const vehicleSchema = new Schema<IVehicle>(
  {
    vehicleNumber: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    capacity: { type: String, required: true },
    vehicleType: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.VEHICLE_TYPE, required: true },
    mfgYear: { type: String },
    chassisNumber: { type: String },
    regNumber: { type: String },
    imageUrls: { type: String },
    status: { type: String, default: ActivityStatus.INACTIVE },
  },
  {
    timestamps: true,
  }
);

const Vehicle = model<IVehicle>(SchemaNames.VEHICLE, vehicleSchema);
export default Vehicle;
