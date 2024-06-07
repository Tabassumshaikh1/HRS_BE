import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppError } from "../classes/app-error.class";
import { AppMessages, Endpoints, HttpStatus, UserRoles } from "../data/app.constants";
import { createVehicle, deleteVehicle, getSingleVehicle, getVehicles, updateVehicle } from "../services/vehicle.service";
import Auth from "../middleware/auth.middleware";

const vehicleController = Router();

vehicleController.post(
  Endpoints.ROOT,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await createVehicle(req.body);
    res.status(HttpStatus.CREATED).json(response);
  })
);

vehicleController.get(
  Endpoints.ROOT,
  Auth(),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getVehicles(req);
    res.status(HttpStatus.OK).json(response);
  })
);

vehicleController.get(
  Endpoints.ID,
  Auth(),
  AsyncHandler(async (req: Request, res: Response) => {
    const vehicle = await getSingleVehicle(req.params.id);
    if (!vehicle) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.VEHICLE_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(vehicle);
  })
);

vehicleController.put(
  Endpoints.ID,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateVehicle(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

vehicleController.delete(
  Endpoints.ID,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteVehicle(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

export default vehicleController;
