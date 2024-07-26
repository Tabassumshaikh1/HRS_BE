import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus } from "../data/app.constants";
import { addVehicleType, getVehicleTypes, updateVehicleType,getSingleVehicleType, deleteVehicleType, } from "../services/vehicleType.service";


const vehicleTypeController = Router();

vehicleTypeController.post(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await addVehicleType(req.body);
    res.status(HttpStatus.CREATED).json(response);
  })
);

vehicleTypeController.get(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getVehicleTypes(req);
    res.status(HttpStatus.OK).json(response);
  })
);

vehicleTypeController.put(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateVehicleType(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

vehicleTypeController.get(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getSingleVehicleType(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

vehicleTypeController.delete(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteVehicleType(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

export default vehicleTypeController;
