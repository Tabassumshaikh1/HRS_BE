import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import { login, logout } from "../services/auth.service";
import { createUser } from "../services/user.service";
const authController = Router();

authController.post(
  Endpoints.REGISTER,
  AsyncHandler(async (req: Request, res: Response) => {
    req.body.role = UserRoles.CUSTOMER;
    const user = await createUser(req.body);
    res.status(HttpStatus.OK).json(user);
  })
);

authController.post(
  Endpoints.LOGIN,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await login(req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

authController.post(
  Endpoints.LOGOUT,
  Auth(),
  AsyncHandler(async (req: Request, res: Response) => {
    const response = logout(req);
    res.status(HttpStatus.OK).json(response);
  })
);

export default authController;
