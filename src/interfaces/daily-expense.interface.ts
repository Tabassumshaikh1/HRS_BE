import { IUser } from "./user.interface"
import { IVehicle } from "./vehicle.interface"

export interface IDailyExpense {
    _id: string,
    vehicle?: string | IVehicle,
    date: string,
    expenseOnFuel?: number,
    challan?: number,
    otherExpenses?: number,
    remark?: string,
    status: string,
    createdBy: string | IUser,
    updatedBy: string | IUser,
    createdAt: string | Date,
    updatedAt: string | Date
}
