import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus, UserRoles } from "../data/app.constants";
import { addUpdateSettings, getSettings } from "../services/common.service";
import Auth from "../middleware/auth.middleware";

const commonController = Router();

commonController.get(
  Endpoints.SETTINGS,
  Auth(),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getSettings();
    res.status(HttpStatus.OK).json(response);
  })
);

commonController.post(
  Endpoints.SETTINGS,
  Auth([UserRoles.ADMIN]),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await addUpdateSettings(req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

export default commonController;
