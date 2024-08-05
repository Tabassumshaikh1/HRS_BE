import mongoose, { Schema, model } from "mongoose";
import { SchemaNames } from "../data/app.constants";
import { IDailyExpense } from "../interfaces/daily-expense.interface";

const dailyExpenseSchema = new Schema<IDailyExpense>(
  {
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.VEHICLE },
    date: { type: Date, required: true },
    expenseOnFuel: { type: Number },
    challan: { type: Number },
    otherExpenses: { type: Number },
    remark: { type: String },
    status: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.USER },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.USER },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const DailyExpense = model<IDailyExpense>(SchemaNames.DAILY_EXPENSE, dailyExpenseSchema);
export default DailyExpense;
