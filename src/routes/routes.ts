import { Router } from "express";
import authController from "../controllers/auth.controller";
import driverController from "../controllers/driver.controller";
import { Routes, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import vehicleController from "../controllers/vehicle.constroller";

const routes = Router();

routes.use(Routes.AUTH, authController);
routes.use(Routes.DRIVERS, Auth([UserRoles.ADMIN]), driverController);
routes.use(Routes.VEHICLES, vehicleController);

export default routes;
