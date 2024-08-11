import { Request, Response, Router } from "express";
import AsyncHandler from "express-async-handler";
import { Endpoints, HttpStatus } from "../data/app.constants";
import { addAddress, deleteAddress, getAddressById, updateAddress, getAllAddress, makeAddressPrimary } from "../services/address.service";

const addressController = Router();

addressController.post(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await addAddress(req);
    res.status(HttpStatus.CREATED).json(response);
  })
);

addressController.get(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getAddressById(req.params.id);
    res.status(HttpStatus.OK).json(response);
  })
);

addressController.put(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await updateAddress(req);
    res.status(HttpStatus.OK).json(response);
  })
);

addressController.get(
  Endpoints.ROOT,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await getAllAddress(req);
    res.status(HttpStatus.OK).json(response);
  })
);

addressController.delete(
  Endpoints.ID,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await deleteAddress(req);
    res.status(HttpStatus.OK).json(response);
  })
);

addressController.put(
  Endpoints.PRIMARY_ADDRESS,
  AsyncHandler(async (req: Request, res: Response) => {
    const response = await makeAddressPrimary(req);
    res.status(HttpStatus.OK).json(response);
  })
);

export default addressController;
