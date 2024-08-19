import { NextFunction, Request, Response } from "express";
import { AppMessages, Environment, HttpStatus, MongooseInternalKeys } from "../data/app.constants";
import { camelToTitleCase } from "../services/util.service";

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HttpStatus.NOT_FOUND);
  next(error);
};

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = err?.code || HttpStatus.INTERNAL_SERVER_ERROR;
  let message = err.message;

  // If Mongoose not found error, set to 404 and change message
  if (err.name === MongooseInternalKeys.CAST_ERROR && err.kind === MongooseInternalKeys.OBJECT_ID) {
    statusCode = HttpStatus.NOT_FOUND;
    message = AppMessages.NOT_FOUND;
  }

  if (err.code === MongooseInternalKeys.ALREADY_EXIST_ERROR_CODE) {
    statusCode = HttpStatus.BAD_REQUEST;
    message = `${camelToTitleCase(Object.keys(err.keyValue)[0])} already exists`;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === Environment.DEVELOPMENT || process.env.NODE_ENV === Environment.UAT ? err.stack : null,
  });
};

export { notFound, errorHandler };
