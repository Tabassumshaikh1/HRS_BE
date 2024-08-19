import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppError } from "../classes/app-error.class";
import { AppMessages, CommonConst, HttpStatus, UserRoles, ActivityStatus } from "../data/app.constants";
import { cacheGetItem } from "../services/cache.service";

const Auth = (roles?: `${UserRoles}`[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.headers && req.headers.authorization
        ? req.headers.authorization.split(CommonConst.JWT_TOKEN_PREFIX)[1]
        : CommonConst.EMPTY_STRING;
    try {
      const tokenInfo: any = jwt.verify(token, process.env.TOKEN_SECRET_KEY || CommonConst.EMPTY_STRING);
      // Checking token is exist in cache or not
      if (!cacheGetItem(tokenInfo.userId)) {
        throw new AppError(HttpStatus.UNAUTHORIZED, AppMessages.SESSION_EXPIRED);
      }
      const userInfo: any = cacheGetItem(tokenInfo.userId);
      req.user = userInfo.user;
      if (req.user.status !== ActivityStatus.ACTIVE) {
        throw new AppError(HttpStatus.UNAUTHORIZED, AppMessages.ACCOUNT_INACTIVE);
      }
      if (roles?.length && !roles.includes(req.user.role)) {
        throw new AppError(HttpStatus.FORBIDDEN, AppMessages.UNAUTHORIZED);
      }
      next();
    } catch (error: any) {
      let message = error.message;
      if (message === CommonConst.JWT_EXPIRED || error?.name === CommonConst.TOKEN_EXPIRED_ERROR) {
        message = AppMessages.SESSION_EXPIRED;
      }
      res.status(error?.code || HttpStatus.UNAUTHORIZED).json({ message: message || error?.message || AppMessages.SESSION_EXPIRED, error });
    }
  };
};

export default Auth;
