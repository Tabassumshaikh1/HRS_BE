import { ActivityStatus } from "../data/app.constants";
import { IVehicleType } from "./vehicle-type.interface";

export interface IVehicle {
  _id?: string;
  vehicleNumber: string;
  company: string;
  capacity: string;
  mfgYear?: number;
  vehicleType: IVehicleType | string | null;
  chassisNumber?: string;
  regNumber?: string;
  imageUrl?: string;
  status: `${ActivityStatus}`;
}
