import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppError } from "../classes/app-error.class";
import { ActivityStatus, AppMessages, Endpoints, HttpStatus, ModuleNames, UserRoles } from "../data/app.constants";
import { IVehicleImage } from "../interfaces/vehicle.interface";
import Auth from "../middleware/auth.middleware";
import { uploadFileOnFirebase } from "../services/file-upload.service";
import { getUniqueId } from "../services/util.service";
import {
  createVehicle,
  deleteVehicle,
  deleteVehicleImage,
  getSingleVehicle,
  getVehicles,
  updateVehicle,
  updateVehicleStatus,
} from "../services/vehicle.service";
import { multipleImageValidator } from "../validators/image.validator";

const vehicleController = Router();

vehicleController.post(
  Endpoints.ROOT,
  Auth([UserRoles.ADMIN]),
  multipleImageValidator,
  AsyncHandler(async (req: Request, res: Response) => {
    let uploadedFileUrl = null;
    const files: IVehicleImage[] = [];
    if (req.files) {
      for (const file of req.files as any[]) {
        uploadedFileUrl = await uploadFileOnFirebase(file as Express.Multer.File, ModuleNames.VEHICLE);
        if (uploadedFileUrl) {
          files.push({
            id: getUniqueId(),
            imageUrl: uploadedFileUrl,
          });
        }
      }
    }
    req.body.imageUrls = files;
    req.body.status = ActivityStatus.ACTIVE;
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
  multipleImageValidator,
  AsyncHandler(async (req: Request, res: Response) => {
    let uploadedFileUrl = null;
    const files: IVehicleImage[] = [];
    if (req.files) {
      for (const file of req.files as any[]) {
        uploadedFileUrl = await uploadFileOnFirebase(file as Express.Multer.File, ModuleNames.VEHICLE);
        if (uploadedFileUrl) {
          files.push({
            id: getUniqueId(),
            imageUrl: uploadedFileUrl,
          });
        }
      }
    }
    req.body.imageUrls = files;
    const response = await updateVehicle(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

vehicleController.put(
  Endpoints.UPDATE_STATUS,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateVehicleStatus(req.params.id, req.body);
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

vehicleController.delete(
  Endpoints.DELETE_VEHICLE_IMAGE,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteVehicleImage(req.params.id, req.params.imageId);
    res.status(HttpStatus.OK).json(response);
  })
);

export default vehicleController;
