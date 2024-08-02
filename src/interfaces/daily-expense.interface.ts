import { DailyExpenseStatus } from "../data/app.constants";
import { IUser } from "./user.interface";
import { IVehicle } from "./vehicle.interface";

export interface IDailyExpense {
  _id: string;
  vehicle?: string | IVehicle;
  date: Date | string;
  expenseOnFuel?: number;
  challan?: number;
  otherExpenses?: number;
  remark?: string;
  status: `${DailyExpenseStatus}`;
  createdBy: string | IUser;
  updatedBy: string | IUser;
  createdAt: string | Date;
  updatedAt: string | Date;
}
