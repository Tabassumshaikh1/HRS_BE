import { Request } from "express";
import { AppError } from "../classes/app-error.class";
import {
  AppDefaults,
  AppMessages,
  CommonConst,
  DailyExpenseStatus,
  HttpStatus,
  PopulateKeys,
  QueryBuilderKeys,
  SortBy,
  UserRoles,
  ValidationKeys,
} from "../data/app.constants";
import { IDailyExpense } from "../interfaces/daily-expense.interface";
import DailyExpense from "../models/daily-expense-model";
import validate from "../validators/validation";
import { buildQuery } from "./util.service";
import { IQuery } from "../interfaces/query.interface";
import { IListResponse } from "../interfaces/response.interface";

const createDailyExpense = async (req: Request): Promise<IDailyExpense> => {
  // Validating Daily Expense before saving into DB
  const errorMessage = validate(ValidationKeys.DAILY_EXPENSE, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  // Saving data in DB
  const dailyExpense = new DailyExpense({
    vehicle: req.body.vehicle,
    date: req.body.date,
    expenseOnFuel: req.body.expenseOnFuel,
    challan: req.body.challan,
    otherExpenses: req.body.otherExpenses,
    remark: req.body.remark,
    status: req.user.role === UserRoles.ADMIN ? DailyExpenseStatus.APPROVED : DailyExpenseStatus.PENDING,
    createdBy: req.user._id,
    updatedBy: req.user._id,
  });
  return (await dailyExpense.save()).populate(PopulateKeys.DAILY_EXPENSE);
};

const getSingleExpense = async (id: string): Promise<IDailyExpense | null> => {
  return await DailyExpense.findOne({ _id: id }).populate(PopulateKeys.DAILY_EXPENSE);
};

const getDailyExpenses = async (req: Request): Promise<IListResponse> => {
  const { query, queryParams } = buildQuery(QueryBuilderKeys.DAILY_EXPENSE, req, {
    sort: AppDefaults.SORT,
    sortBy: SortBy.ASC,
  } as IQuery);

  const DailyExpenseData = await DailyExpense.find(query)
    .sort([[queryParams.sort, queryParams.sortBy]])
    .skip(queryParams.page * queryParams.limit)
    .limit(queryParams.limit)
    .populate(PopulateKeys.DAILY_EXPENSE);

  const total = await DailyExpense.countDocuments(query);

  return {
    data: DailyExpenseData,
    total,
  };
};

const updateDailyExpense = async (id: string, req: Request): Promise<any> => {
  // Validating daily expense before saving into DB
  const errorMessage = validate(ValidationKeys.DAILY_EXPENSE, req.body);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const dailyExpense = await getSingleExpense(id);
  if (!dailyExpense) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DAILY_EXPENSE_NOT_EXISTS);
  }

  if (dailyExpense.status === DailyExpenseStatus.APPROVED) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DAILY_EXPENSE_ALREADY_APPROVED);
  }

  req.body.updatedBy = req.user._id;
  req.body.status = req.user.role === UserRoles.ADMIN ? DailyExpenseStatus.APPROVED : DailyExpenseStatus.PENDING;
  return await DailyExpense.findByIdAndUpdate(id, req.body).populate(PopulateKeys.DAILY_EXPENSE);
};

const deleteDailyExpense = async (req: Request): Promise<any> => {
  const dailyExpense = await getSingleExpense(req.params.id);
  if (!dailyExpense) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DAILY_EXPENSE_NOT_EXISTS);
  }

  if (dailyExpense.status === DailyExpenseStatus.APPROVED && req.user.role === UserRoles.DRIVER) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DAILY_EXPENSE_ALREADY_APPROVED);
  }

  return await DailyExpense.deleteOne({ _id: req.params.id });
};

const updateDailyExpenseStatus = async (id: string, req: Request): Promise<any> => {
  const payload: any = {
    status: req.body.status || CommonConst.EMPTY_STRING,
  };

  const errorMessage = validate(ValidationKeys.DAILY_EXPENSE_STATUS, payload);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const dailyExpense = await getSingleExpense(id);
  if (!dailyExpense) {
    throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.DAILY_EXPENSE_NOT_EXISTS);
  }
  payload.updatedBy = req.user._id;
  return await DailyExpense.findByIdAndUpdate(id, payload);
};

export { createDailyExpense, updateDailyExpense, deleteDailyExpense, getDailyExpenses, getSingleExpense, updateDailyExpenseStatus };
