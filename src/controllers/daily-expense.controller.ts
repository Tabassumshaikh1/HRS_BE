import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus, UserRoles } from "../data/app.constants";
import {
  createDailyExpense,
  updateDailyExpense,
  deleteDailyExpense,
  getDailyExpenses,
  getSingleExpense,
  updateDailyExpenseStatus,
} from "../services/daily-expense.service";
import Auth from "../middleware/auth.middleware";

const dailyExpenseController = Router();

dailyExpenseController.post(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await createDailyExpense(req);
    res.status(HttpStatus.CREATED).json(response);
  })
);

dailyExpenseController.get(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getDailyExpenses(req);
    res.status(HttpStatus.OK).json(response);
  })
);

dailyExpenseController.put(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateDailyExpense(req.params.id, req);
    res.status(HttpStatus.OK).json(response);
  })
);

dailyExpenseController.get(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getSingleExpense(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

dailyExpenseController.put(
  Endpoints.UPDATE_STATUS,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateDailyExpenseStatus(req.params.id, req);
    res.status(HttpStatus.OK).json(response);
  })
);

dailyExpenseController.delete(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteDailyExpense(req);
    res.status(HttpStatus.OK).json(response);
  })
);

export default dailyExpenseController;
