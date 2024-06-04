import { Router } from "express";
import authController from "../controllers/auth.controller";
import { Routes } from "../data/app.constants";

const routes = Router();

routes.use(Routes.AUTH, authController);

export default routes;
