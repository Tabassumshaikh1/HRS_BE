import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { AppError } from "../classes/app-error.class";
import { AppMessages, Endpoints, HttpStatus } from "../data/app.constants";
import { getCustomers, getSingleCustomer, updateCustomerStatus } from "../services/customer.service";

const customerController = Router();

customerController.get(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getCustomers(req);
    res.status(HttpStatus.OK).json(response);
  })
);

customerController.get(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const customer = await getSingleCustomer(req.params.id);
    if (!customer) {
      throw new AppError(HttpStatus.NOT_FOUND, AppMessages.CUSTOMER_NOT_EXIST);
    }
    res.status(HttpStatus.OK).json(customer);
  })
);

customerController.put(
  Endpoints.UPDATE_STATUS,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateCustomerStatus(req.params.id, req.body);
    res.status(HttpStatus.OK).json(response);
  })
);

export default customerController;
