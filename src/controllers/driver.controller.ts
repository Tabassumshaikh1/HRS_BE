import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppMessages, Endpoints, HttpStatus, UserRoles } from "../data/app.constants";
import { createUser } from "../services/user.service";
import { deleteDriver, getDrivers, getSingleDriver, updateDriver } from "../services/driver.service";
import { AppError } from "../classes/app-error.class";

const driverController = Router();

driverController.post(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    req.body.role = UserRoles.DRIVER;
    const response = await createUser(req.body);
    res.status(HttpStatus.CREATED).json(response);
  })
);

driverController.get(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getDrivers(req);
    res.status(HttpStatus.OK).json(response);
  })
);

driverController.get(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const driver = await getSingleDriver(req.params.id);
    if (!driver) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.DRIVER_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(driver);
  })
);

driverController.put(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateDriver(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

driverController.delete(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteDriver(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

export default driverController;
