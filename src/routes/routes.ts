import { Router } from "express";
import authController from "../controllers/auth.controller";
import driverController from "../controllers/driver.controller";
import { Routes, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import vehicleController from "../controllers/vehicle.constroller";
import customerController from "../controllers/customer.controller";
import vehicleTypeController from "../controllers/vehicleType.controller";

const routes = Router();

routes.use(Routes.AUTH, authController);
routes.use(Routes.DRIVERS, Auth([UserRoles.ADMIN]), driverController);
routes.use(Routes.VEHICLES, vehicleController);
routes.use(Routes.CUSTOMERS, Auth([UserRoles.ADMIN]), customerController);
routes.use(Routes.VEHICLETYPE , Auth([UserRoles.ADMIN]), vehicleTypeController)

export default routes;
