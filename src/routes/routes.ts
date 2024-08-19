import { Router } from "express";
import authController from "../controllers/auth.controller";
import driverController from "../controllers/driver.controller";
import { Routes, UserRoles } from "../data/app.constants";
import Auth from "../middleware/auth.middleware";
import vehicleController from "../controllers/vehicle.constroller";
import customerController from "../controllers/customer.controller";
import vehicleTypeController from "../controllers/vehicleType.controller";
import dailyExpenseController from "../controllers/daily-expense.controller";
import addressController from "../controllers/address.controller";
import commonController from "../controllers/common.controller";

const routes = Router();

routes.use(Routes.AUTH, authController);
routes.use(Routes.DRIVERS, Auth([UserRoles.ADMIN]), driverController);
routes.use(Routes.VEHICLES, vehicleController);
routes.use(Routes.CUSTOMERS, Auth([UserRoles.ADMIN]), customerController);
routes.use(Routes.VEHICLE_TYPE, Auth([UserRoles.ADMIN]), vehicleTypeController);
routes.use(Routes.DAILY_EXPENSE, Auth([UserRoles.ADMIN, UserRoles.DRIVER]), dailyExpenseController);
routes.use(Routes.ADDRESS, Auth([UserRoles.CUSTOMER]), addressController);
routes.use(Routes.COMMON, commonController);
export default routes;
