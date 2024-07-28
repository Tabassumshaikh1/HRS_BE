import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus } from "../data/app.constants";
import { createDailyExpense, updateDailyExpense } from "../services/daily-expense.service";


const dailyExpenseController = Router();

dailyExpenseController.post(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await createDailyExpense(req);
    res.status(HttpStatus.CREATED).json(response);
  })
);

// dailyExpenseController.get(
//   Endpoints.ROOT,
//   AsyncHandler(async (req: Request, res: Response) => {
//     const response = await getVehicleTypes(req);
//     res.status(HttpStatus.OK).json(response);
//   })
// );

dailyExpenseController.put(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateDailyExpense(req.params.id, req);
    res.status(HttpStatus.OK).json(response);
  })
);

// vehicleTypeController.get(
//   Endpoints.ID,
//   AsyncHandler(async (req: Request, res: Response) => {
//     const response = await getSingleVehicleType(req.params.id);
//     res.status(HttpStatus.OK).json(response);
//   })
// );

// vehicleTypeController.delete(
//   Endpoints.ID,
//   AsyncHandler(async (req: Request, res: Response) => {
//     const response = await deleteVehicleType(req.params.id);
//     res.status(HttpStatus.OK).json(response);
//   })
// );

export default dailyExpenseController;
