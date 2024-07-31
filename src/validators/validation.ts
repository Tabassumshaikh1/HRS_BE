import * as Joi from "joi";
import { UserRoles, ActivityStatus, ValidationKeys } from "../data/app.constants";

const schemas = {
  [ValidationKeys.NEW_USER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.any(),
    email: Joi.string().email().required(),
    contactNumber: Joi.any(),
    licenseNumber: Joi.any(),
    password: Joi.string().required().min(8),
    googleId: Joi.any(),
    role: Joi.string().valid(UserRoles.ADMIN, UserRoles.DRIVER, UserRoles.CUSTOMER).required(),
    imageUrl: Joi.any(),
    status: Joi.string().valid(ActivityStatus.ACTIVE, ActivityStatus.INACTIVE),
  }),

  [ValidationKeys.LOGIN]: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),

  [ValidationKeys.UPDATE_DRIVER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    licenseNumber: Joi.any(),
    imageUrl: Joi.any(),
    status: Joi.string().valid(ActivityStatus.ACTIVE, ActivityStatus.INACTIVE),
  }),

  [ValidationKeys.VEHICLE]: Joi.object({
    vehicleNumber: Joi.string().required(),
    company: Joi.string().required(),
    capacity: Joi.string().required(),
    vehicleType: Joi.string().required(),
    mfgYear: Joi.any(),
    chassisNumber: Joi.any(),
    regNumber: Joi.any(),
    imageUrls: Joi.any(),
    status: Joi.string().valid(ActivityStatus.ACTIVE, ActivityStatus.INACTIVE),
  }),
  [ValidationKeys.UPDATE_USER_STATUS]: Joi.object({
    status: Joi.string().required().valid(ActivityStatus.ACTIVE, ActivityStatus.INACTIVE),
  }),
  [ValidationKeys.VEHICLE_TYPE]: Joi.object({
    name: Joi.string().required(),
  }),
  [ValidationKeys.DAILY_EXPENSE]: Joi.object({
    vehicle: Joi.string(),
    date: Joi.string().required(),
    expenseOnFuel: Joi.number(),
    challan: Joi.number(),
    otherExpenses: Joi.number(),
    remark: Joi.string(),
  }),
};

const validate = (key: `${ValidationKeys}`, reqBody: any): boolean | string => {
  const { error } = schemas[key].validate(reqBody);
  return error?.details[0].message || false;
};

export default validate;
