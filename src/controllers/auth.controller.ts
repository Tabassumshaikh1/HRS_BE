import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus } from "../data/app.constants";
import { login, logout } from "../services/auth.service";
const authController = Router();

authController.post(
  Endpoints.LOGIN,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await login(req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

authController.post(
  Endpoints.LOGOUT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = logout(req);
    res.status(HttpStatus.OK).json(response);
  })
);

export default authController;
