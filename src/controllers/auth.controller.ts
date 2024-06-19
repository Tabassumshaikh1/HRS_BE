import { Request, Response, Router, request } from "express";
import AsyncHandler from "express-async-handler";
import { AppMessages, Endpoints, HttpStatus, ModuleNames, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import { login, logout, signInWithGoogle } from "../services/auth.service";
import { createUser } from "../services/user.service";
import { uploadFileOnFirebase } from "../services/file-upload.service";
import { AppError } from "../classes/app-error.class";
import imageValidator from "../validators/image.validator";
const authController = Router();

authController.post(
  Endpoints.REGISTER,
  imageValidator,
  AsyncHandler(async (req: Request, res: Response) => {
    let uploadedFileUrl = null;
    if (req.file) {
      uploadedFileUrl = await uploadFileOnFirebase(req.file as Express.Multer.File, ModuleNames.CUSTOMER);
      if (!uploadedFileUrl) {
        throw new AppError(HttpStatus.BAD_REQUEST, AppMessages.INVALID_IMAGE);
      }
    }
    req.body.imageUrl = uploadedFileUrl;
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
  Endpoints.GOOGLE_SIGNIN,
  AsyncHandler(async (req: Request, res: Response) => {
    req.body.role = UserRoles.CUSTOMER;
    const response = await signInWithGoogle(req.body);
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
