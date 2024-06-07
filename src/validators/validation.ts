import * as Joi from "joi";
import { UserRoles, ActivityStatus, ValidationKeys } from "../data/app.constants";

const schemas = {
  [ValidationKeys.NEW_USER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    licenseNumber: Joi.any(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid(UserRoles.ADMIN, UserRoles.DRIVER, UserRoles.CUSTOMER).required(),
    profileImage: Joi.any(),
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
    profileImage: Joi.any(),
    status: Joi.string().valid(ActivityStatus.ACTIVE, ActivityStatus.INACTIVE),
  }),

  [ValidationKeys.VEHICLE]: Joi.object({
    vehicleNumber: Joi.string().required(),
    company: Joi.string().required(),
    capacity: Joi.string().required(),
    mfgYear: Joi.any(),
    chassisNumber: Joi.any(),
    regNumber: Joi.any(),
    status: Joi.string().valid(ActivityStatus.ACTIVE, ActivityStatus.INACTIVE),
  }),
};

const validate = (key: `${ValidationKeys}`, reqBody: any): boolean | string => {
  const { error } = schemas[key].validate(reqBody);
  return error?.details[0].message || false;
};

export default validate;
