import { ActivityStatus } from "../data/app.constants";

export interface IVehicle {
  _id?: string;
  vehicleNumber: string;
  company: string;
  capacity: string;
  mfgYear?: number;
  chassisNumber?: string;
  regNumber?: string;
  status: `${ActivityStatus}`;
}
